import OpenAI from "openai";
import handleError from "../errors/userErrors";
import { getTemplateById } from "../../data/templates";
import type { TemplateId } from "../../data/templates";
import { getPortalById } from "../../data/portals";
import type { PortalId } from "../../data/portals";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export type GenerateOptions = {
  templateId?: TemplateId | string;
  portalId?: PortalId | string;
  outputFormat?: "simple" | "full";
  /** data:image/...;base64,... */
  imageDataUrl?: string;
};

export interface GeneratedFull {
  title: string;
  short: string;
  long: string;
}

const DATA_URL_RE = /^data:image\/(jpeg|jpg|png|webp);base64,/i;

export function isValidImageDataUrl(value: string): boolean {
  return DATA_URL_RE.test(value) && value.length > 32 && value.length <= 1_400_000;
}

function clampText(value: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max).trimEnd();
}

function buildSystemPrompt(
  portalId: PortalId | string,
  isFull: boolean
): string {
  const portal = getPortalById(portalId);

  if (portal.id === "olx") {
    if (isFull) {
      return [
        "Odpowiedz wyłącznie w formacie JSON (bez markdown, bez ```):",
        '{"title":"chwytliwy tytuł","short":"krótki opis","long":"pełny opis ogłoszenia"}.',
        `Portal: OLX.`,
        `Tytuł: chwytliwy, sprzedażowy, maksymalnie ${portal.titleMax} znaków.`,
        `short: do ${portal.shortMax} znaków.`,
        `long (opis): minimum ${portal.descriptionMin} znaków, maksymalnie ${portal.descriptionMax} znaków.`,
        "Pisz po polsku. Nie zmyślaj faktów niewidocznych na zdjęciu — jeśli czegoś nie widać, pomiń lub napisz ogólnie.",
      ].join(" ");
    }

    return [
      "Odpowiedz wyłącznie w formacie JSON (bez markdown, bez ```):",
      '{"title":"chwytliwy tytuł","long":"pełny opis ogłoszenia"}.',
      `Portal: OLX.`,
      `Tytuł: chwytliwy, sprzedażowy, maksymalnie ${portal.titleMax} znaków.`,
      `Opis (long): minimum ${portal.descriptionMin} znaków, maksymalnie ${portal.descriptionMax} znaków.`,
      "Pisz po polsku, styl ogłoszeniowy pod OLX. Nie zmyślaj faktów niewidocznych na zdjęciu — jeśli czegoś nie widać, pomiń lub napisz ogólnie.",
    ].join(" ");
  }

  // Marketplace
  if (isFull) {
    return [
      "Odpowiedz wyłącznie w formacie JSON (bez markdown, bez ```):",
      '{"title":"tytuł ogłoszenia","short":"krótki opis","long":"pełny opis ogłoszenia"}.',
      `Portal: Facebook Marketplace / Allegro.`,
      `Tytuł max ${portal.titleMax} znaków. short max ${portal.shortMax} znaków.`,
      `long: ${portal.descriptionMin}–${portal.descriptionMax} znaków, zwięźle, cechy + CTA.`,
      "Pisz po polsku. Nie zmyślaj faktów niewidocznych na zdjęciu.",
    ].join(" ");
  }

  return [
    "Odpowiedz tylko treścią ogłoszenia po polsku, bez dodatkowych nagłówków ani komentarzy.",
    `Styl sprzedażowy pod Marketplace. Opis ${portal.descriptionMin}–${portal.descriptionMax} znaków.`,
    "Nie zmyślaj faktów niewidocznych na zdjęciu — jeśli czegoś nie widać, pomiń lub napisz ogólnie.",
  ].join(" ");
}

/**
 * Generuje opis (prosty) lub tytuł + wersje krótka/długa.
 * Opcjonalnie na podstawie zdjęcia (Vision).
 */
export const generateDescription = async (
  input: string,
  options?: GenerateOptions
): Promise<string | GeneratedFull> => {
  const template = getTemplateById(options?.templateId ?? "default");
  const portal = getPortalById(options?.portalId ?? "olx");
  const promptPrefix = template.promptPrefix;
  const isFull = options?.outputFormat === "full";
  const imageDataUrl = options?.imageDataUrl?.trim();
  const hasImage = Boolean(imageDataUrl);
  const structuredOlx = portal.id === "olx";

  if (hasImage && imageDataUrl && !isValidImageDataUrl(imageDataUrl)) {
    throw handleError(400, "Nieprawidłowy format zdjęcia");
  }

  const systemPrompt = buildSystemPrompt(portal.id, isFull);

  const textParts = [
    promptPrefix,
    `Cel publikacji: ${portal.name}.`,
    hasImage
      ? "Na podstawie ZAŁĄCZONEGO ZDJĘCIA rozpoznaj produkt/przedmiot i stwórz atrakcyjne ogłoszenie. Wyodrębnij widoczne cechy (rodzaj, kolor, stan, marka jeśli czytelna, kontekst)."
      : null,
    input.trim()
      ? `Dodatkowe informacje od sprzedającego:\n${input.trim()}`
      : hasImage
        ? "Brak dodatkowych słów kluczowych — bazuj na zdjęciu."
        : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const model = hasImage
    ? process.env.OPENAI_VISION_MODEL || "gpt-4o-mini"
    : process.env.OPENAI_MODEL || "gpt-3.5-turbo";

  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] =
    hasImage && imageDataUrl
      ? [
          { type: "text", text: textParts },
          {
            type: "image_url",
            image_url: { url: imageDataUrl, detail: "low" },
          },
        ]
      : [{ type: "text", text: textParts }];

  // Dłuższy opis OLX (do 9000 znaków) wymaga wyższego limitu tokenów.
  const maxTokens =
    portal.id === "olx" ? (isFull ? 3500 : 3000) : isFull ? 900 : 600;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      max_tokens: maxTokens,
    });
    const raw = response.choices[0].message.content;
    if (!raw || !raw.trim()) {
      throw handleError(500, "Brak odpowiedzi z OpenAI");
    }

    if (isFull || structuredOlx) {
      const cleaned = raw.replace(/^```\w*\n?|\n?```$/g, "").trim();
      try {
        const parsed = JSON.parse(cleaned) as Partial<GeneratedFull> & {
          long?: string;
        };
        const title =
          typeof parsed.title === "string"
            ? clampText(parsed.title, portal.titleMax)
            : "";
        const short =
          typeof parsed.short === "string"
            ? clampText(parsed.short, portal.shortMax)
            : "";
        const longRaw =
          typeof parsed.long === "string"
            ? parsed.long
            : typeof raw === "string"
              ? raw
              : "";
        const long = clampText(longRaw, portal.descriptionMax);

        if (long) {
          return {
            title,
            short: isFull ? short : "",
            long,
          };
        }
      } catch {
        /* fallback below */
      }

      if (structuredOlx && !isFull) {
        return {
          title: "",
          short: "",
          long: clampText(raw, portal.descriptionMax),
        };
      }

      return {
        title: "",
        short: clampText(raw, portal.shortMax),
        long: clampText(raw, portal.descriptionMax),
      };
    }

    return clampText(raw, portal.descriptionMax);
  } catch (error: unknown) {
    console.error("OPENAI ERROR:", error);

    if (error && typeof error === "object" && "status" in error) {
      const apiErr = error as {
        status?: number;
        message?: string;
        code?: string;
      };
      const status = apiErr.status || 500;
      const rawMsg = apiErr.message || "";

      if (status === 400 && /image|vision|content/i.test(rawMsg)) {
        throw handleError(
          400,
          "Model AI nie przyjął zdjęcia. Spróbuj innego pliku JPG/PNG."
        );
      }
      if (status === 429) {
        throw handleError(429, "Limit OpenAI — spróbuj za chwilę.");
      }
      if (status >= 500) {
        throw handleError(
          502,
          "Chwilowy błąd OpenAI przy analizie zdjęcia. Spróbuj ponownie."
        );
      }
      throw handleError(
        status >= 400 && status < 600 ? status : 500,
        "Błąd podczas generowania opisu"
      );
    }

    throw handleError(500, "Błąd podczas generowania opisu");
  }
};
