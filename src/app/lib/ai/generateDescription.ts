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
};

export interface GeneratedFull {
  title: string;
  short: string;
  long: string;
}

/**
 * Generuje opis (prosty) lub tytuł + wersje krótka/długa.
 * templateId: szablon branżowy (default, car, rental, job, services, marketplace).
 */
export const generateDescription = async (
  input: string,
  options?: GenerateOptions
): Promise<string | GeneratedFull> => {
  const template = getTemplateById(options?.templateId ?? "default");
  const promptPrefix = template.promptPrefix;
  const isFull = options?.outputFormat === "full";

  const systemPrompt = isFull
    ? "Odpowiedz wyłącznie w formacie JSON (bez markdown, bez ```): {\"title\": \"tytuł ogłoszenia\", \"short\": \"krótki opis do 160 znaków\", \"long\": \"pełny opis ogłoszenia\"}. Tytuł max 80 znaków."
    : "Odpowiedz tylko treścią ogłoszenia, bez dodatkowych nagłówków ani komentarzy.";

  const userPrompt = `${promptPrefix}\n\n${input}`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    const raw = response.choices[0].message.content;
    if (!raw || !raw.trim()) {
      throw handleError(500, "Brak odpowiedzi z OpenAI");
    }

    if (isFull) {
      const cleaned = raw.replace(/^```\w*\n?|\n?```$/g, "").trim();
      const parsed = JSON.parse(cleaned) as GeneratedFull;
      if (
        typeof parsed.title !== "string" ||
        typeof parsed.short !== "string" ||
        typeof parsed.long !== "string"
      ) {
        return { title: "", short: raw, long: raw };
      }
      return parsed;
    }

    return raw.trim();
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    if (error && typeof error === "object" && "status" in error) throw error;
    throw handleError(500, "Błąd podczas generowania opisu");
  }
};
