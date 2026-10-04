import OpenAI from "openai";
import handleError from "../errors/userErrors";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export type RewriteMode =
  | "shorter"
  | "stronger_cta"
  | "formal"
  | "no_emoji";

const MODE_INSTRUCTIONS: Record<RewriteMode, string> = {
  shorter: "Skróć tekst o ok. 30–40%, zachowaj kluczowe fakty i CTA.",
  stronger_cta:
    "Wzmocnij wezwanie do działania (kontakt, szybka decyzja), bez nachalnego spamu.",
  formal: "Uczyń ton bardziej formalny i profesjonalny.",
  no_emoji: "Usuń wszystkie emoji i zbędne ozdobniki, zostaw czysty tekst.",
};

export async function rewriteListingText(params: {
  text: string;
  mode: RewriteMode;
  title?: string;
}): Promise<{ title?: string; description: string }> {
  const text = params.text.trim();
  if (text.length < 20) {
    throw handleError(400, "Za mało treści do poprawy");
  }
  if (text.length > 12000) {
    throw handleError(400, "Tekst jest za długi do poprawy");
  }

  const modeHelp = MODE_INSTRUCTIONS[params.mode];
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  try {
    const response = await openai.chat.completions.create({
      model,
      temperature: 0.5,
      max_tokens: 2500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Odpowiedz wyłącznie JSON: {"title":"...opcjonalnie...","description":"..."}. Zachowaj język polski i fakty. Nie dodawaj komentarzy.',
        },
        {
          role: "user",
          content: [
            `Tryb poprawy: ${params.mode}`,
            modeHelp,
            params.title?.trim() ? `Tytuł:\n${params.title.trim()}` : null,
            `Opis:\n${text}`,
          ]
            .filter(Boolean)
            .join("\n\n"),
        },
      ],
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw handleError(500, "Brak odpowiedzi z OpenAI");

    try {
      const parsed = JSON.parse(raw) as {
        title?: string;
        description?: string;
      };
      const description =
        typeof parsed.description === "string" && parsed.description.trim()
          ? parsed.description.trim()
          : text;
      const title =
        typeof parsed.title === "string" && parsed.title.trim()
          ? parsed.title.trim()
          : params.title;
      return { title, description };
    } catch {
      return { title: params.title, description: raw.trim() || text };
    }
  } catch (error: unknown) {
    if (error && typeof error === "object" && "status" in error) {
      const apiErr = error as { status?: number };
      if (apiErr.status === 429) {
        throw handleError(429, "Limit OpenAI — spróbuj za chwilę.");
      }
    }
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }
    throw handleError(500, "Błąd podczas poprawiania opisu");
  }
}
