import OpenAI from "openai";
import handleError from "../errors/userErrors";
import { getTemplateById } from "../../data/templates";
import type { TemplateId } from "../../data/templates";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export type GenerateOptions = {
  templateId?: TemplateId | string;
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

/**
 * Generuje opis (prosty) lub tytuł + wersje krótka/długa.
 * Opcjonalnie na podstawie zdjęcia (Vision).
 */
export const generateDescription = async (
  input: string,
  options?: GenerateOptions
): Promise<string | GeneratedFull> => {
  const template = getTemplateById(options?.templateId ?? "default");
  const promptPrefix = template.promptPrefix;
  const isFull = options?.outputFormat === "full";
  const imageDataUrl = options?.imageDataUrl?.trim();
  const hasImage = Boolean(imageDataUrl);

  if (hasImage && imageDataUrl && !isValidImageDataUrl(imageDataUrl)) {
    throw handleError(400, "Nieprawidłowy format zdjęcia");
  }

  const systemPrompt = isFull
    ? "Odpowiedz wyłącznie w formacie JSON (bez markdown, bez ```): {\"title\": \"tytuł ogłoszenia\", \"short\": \"krótki opis do 160 znaków\", \"long\": \"pełny opis ogłoszenia\"}. Tytuł max 80 znaków. Pisz po polsku, styl sprzedażowy pod OLX / Marketplace. Nie zmyślaj faktów niewidocznych na zdjęciu — jeśli czegoś nie widać, pomiń lub napisz ogólnie."
    : "Odpowiedz tylko treścią ogłoszenia po polsku, bez dodatkowych nagłówków ani komentarzy. Styl sprzedażowy pod OLX / Marketplace. Nie zmyślaj faktów niewidocznych na zdjęciu — jeśli czegoś nie widać, pomiń lub napisz ogólnie.";

  const textParts = [
    promptPrefix,
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
    ? process.env.OPENAI_VISION_MODEL ||
      process.env.OPENAI_MODEL ||
      "gpt-4o-mini"
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

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      max_tokens: isFull ? 900 : 600,
    });
    const raw = response.choices[0].message.content;
    if (!raw || !raw.trim()) {
      throw handleError(500, "Brak odpowiedzi z OpenAI");
    }

    if (isFull) {
      const cleaned = raw.replace(/^```\w*\n?|\n?```$/g, "").trim();
      try {
        const parsed = JSON.parse(cleaned) as GeneratedFull;
        if (
          typeof parsed.title === "string" &&
          typeof parsed.short === "string" &&
          typeof parsed.long === "string"
        ) {
          return parsed;
        }
      } catch {
        /* fallback below */
      }
      return { title: "", short: raw, long: raw };
    }

    return raw.trim();
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    if (error && typeof error === "object" && "status" in error) throw error;
    throw handleError(500, "Błąd podczas generowania opisu");
  }
};
