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
  /** @deprecated prefer imageDataUrls */
  imageDataUrl?: string;
  imageDataUrls?: string[];
  /** 3 warianty w jednym requestcie */
  variants?: boolean;
};

export interface ListingVariant {
  label: string;
  title: string;
  long: string;
}

export interface GeneratedFull {
  title: string;
  short: string;
  long: string;
  keywords?: string[];
  features?: string[];
  checklist?: string[];
  variants?: ListingVariant[];
}

const DATA_URL_RE = /^data:image\/(jpeg|jpg|png|webp);base64,/i;
const MAX_IMAGES = 3;

export function isValidImageDataUrl(value: string): boolean {
  return (
    DATA_URL_RE.test(value) && value.length > 32 && value.length <= 1_400_000
  );
}

export function normalizeImageDataUrls(
  options?: GenerateOptions
): string[] {
  const fromArray = (options?.imageDataUrls ?? []).filter(Boolean);
  const single = options?.imageDataUrl?.trim();
  const list = [...fromArray];
  if (single && !list.includes(single)) list.unshift(single);
  return list.slice(0, MAX_IMAGES);
}

function clampText(value: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max).trimEnd();
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim())
    .slice(0, 12);
}

function buildSystemPrompt(
  portalId: PortalId | string,
  isFull: boolean,
  wantVariants: boolean
): string {
  const portal = getPortalById(portalId);
  const baseRules = [
    `Portal docelowy: ${portal.name}.`,
    `Ton: ${portal.tone}.`,
    `Tytuł max ${portal.titleMax} znaków.`,
    `Opis (long): ${portal.descriptionMin}–${portal.descriptionMax} znaków.`,
    "Pisz po polsku.",
    "Nie zmyślaj faktów niewidocznych na zdjęciu — jeśli czegoś nie widać, pomiń lub napisz ogólnie.",
    "Dodaj keywords: 3–8 fraz wyszukiwania pod ten portal.",
    "Dodaj features: lista widocznych/istotnych cech produktu.",
    "Dodaj checklist: 4–6 punktów do sprawdzenia przed publikacją (cena, lokalizacja, wady, zdjęcia, stan…).",
  ];

  if (wantVariants) {
    return [
      "Odpowiedz wyłącznie poprawnym JSON (bez markdown):",
      '{"variants":[{"label":"Sprzedażowy","title":"...","long":"..."},{"label":"Konkretny","title":"...","long":"..."},{"label":"Szybka sprzedaż","title":"...","long":"..."}],"keywords":["..."],"features":["..."],"checklist":["..."]}.',
      "Wygeneruj dokładnie 3 wyraźnie różne warianty.",
      ...baseRules,
    ].join(" ");
  }

  if (isFull) {
    return [
      "Odpowiedz wyłącznie poprawnym JSON (bez markdown):",
      '{"title":"...","short":"...","long":"...","keywords":["..."],"features":["..."],"checklist":["..."]}.',
      `short max ${portal.shortMax} znaków.`,
      ...baseRules,
    ].join(" ");
  }

  // structured listing (default for all portals now)
  return [
    "Odpowiedz wyłącznie poprawnym JSON (bez markdown):",
    '{"title":"...","long":"...","keywords":["..."],"features":["..."],"checklist":["..."]}.',
    ...baseRules,
  ].join(" ");
}

function resolveModel(hasImage: boolean): string {
  if (hasImage) {
    return process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";
  }
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

/**
 * Generuje opis / pakiet treści / 3 warianty.
 * Opcjonalnie na podstawie 1–3 zdjęć (Vision).
 */
export const generateDescription = async (
  input: string,
  options?: GenerateOptions
): Promise<GeneratedFull> => {
  const template = getTemplateById(options?.templateId ?? "default");
  const portal = getPortalById(options?.portalId ?? "olx");
  const isFull = options?.outputFormat === "full";
  const wantVariants = Boolean(options?.variants);
  const imageDataUrls = normalizeImageDataUrls(options);
  const hasImage = imageDataUrls.length > 0;

  for (const url of imageDataUrls) {
    if (!isValidImageDataUrl(url)) {
      throw handleError(400, "Nieprawidłowy format zdjęcia");
    }
  }

  const systemPrompt = buildSystemPrompt(portal.id, isFull, wantVariants);

  const textParts = [
    template.promptPrefix,
    `Cel publikacji: ${portal.name}.`,
    hasImage
      ? `Na podstawie ZAŁĄCZONYCH ZDJĘĆ (${imageDataUrls.length}) rozpoznaj produkt i stwórz atrakcyjne ogłoszenie. Wyodrębnij widoczne cechy (rodzaj, kolor, stan, marka jeśli czytelna, wady jeśli widać).`
      : null,
    input.trim()
      ? `Dodatkowe informacje od sprzedającego:\n${input.trim()}`
      : hasImage
        ? "Brak dodatkowych słów kluczowych — bazuj na zdjęciach."
        : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const model = resolveModel(hasImage);

  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    { type: "text", text: textParts },
    ...imageDataUrls.map(
      (url): OpenAI.Chat.Completions.ChatCompletionContentPart => ({
        type: "image_url",
        image_url: { url, detail: "low" },
      })
    ),
  ];

  const maxTokens = wantVariants
    ? 4000
    : portal.id === "olx"
      ? isFull
        ? 3500
        : 3000
      : isFull
        ? 1600
        : 1200;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw || !raw.trim()) {
      throw handleError(500, "Brak odpowiedzi z OpenAI");
    }

    const cleaned = raw.replace(/^```\w*\n?|\n?```$/g, "").trim();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned) as Record<string, unknown>;
    } catch {
      return {
        title: "",
        short: "",
        long: clampText(raw, portal.descriptionMax),
        keywords: [],
        features: [],
        checklist: [],
      };
    }

    const keywords = asStringArray(parsed.keywords);
    const features = asStringArray(parsed.features);
    const checklist = asStringArray(parsed.checklist);

    if (wantVariants && Array.isArray(parsed.variants)) {
      const variants: ListingVariant[] = parsed.variants
        .slice(0, 3)
        .map((v, i) => {
          const item = v as Record<string, unknown>;
          return {
            label:
              typeof item.label === "string" && item.label.trim()
                ? item.label.trim()
                : `Wariant ${i + 1}`,
            title:
              typeof item.title === "string"
                ? clampText(item.title, portal.titleMax)
                : "",
            long:
              typeof item.long === "string"
                ? clampText(item.long, portal.descriptionMax)
                : "",
          };
        })
        .filter((v) => v.long);

      const first = variants[0];
      return {
        title: first?.title ?? "",
        short: "",
        long: first?.long ?? clampText(raw, portal.descriptionMax),
        keywords,
        features,
        checklist,
        variants,
      };
    }

    const title =
      typeof parsed.title === "string"
        ? clampText(parsed.title, portal.titleMax)
        : "";
    const short =
      typeof parsed.short === "string"
        ? clampText(parsed.short, portal.shortMax)
        : "";
    const long =
      typeof parsed.long === "string"
        ? clampText(parsed.long, portal.descriptionMax)
        : clampText(raw, portal.descriptionMax);

    return {
      title,
      short: isFull ? short : short || "",
      long,
      keywords,
      features,
      checklist,
    };
  } catch (error: unknown) {
    console.error("OPENAI ERROR:", error);

    if (error && typeof error === "object" && "status" in error) {
      const apiErr = error as {
        status?: number;
        message?: string;
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
          "Chwilowy błąd OpenAI. Spróbuj ponownie."
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
