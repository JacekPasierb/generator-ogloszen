import OpenAI from "openai";
import handleError from "../errors/userErrors";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const generateDescription = async (input: string): Promise<string> => {
  const prompt = `Na podstawie poniższego opisu stwórz atrakcyjne ogłoszenie sprzedaży w stylu marketingowym:\n\n${input}`;
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [{role: "user", content: prompt}],
    });
    const description = response.choices[0].message.content;
    if (!description) {
      throw handleError(500, "Brak odpowiedzi z OpenAI");
    }
    return description;
  } catch {
    throw handleError(500, "Błąd podczas generowania opisu");
  }
};
