export interface GenerateParams {
  input: string;
  templateId?: string;
  outputFormat?: "simple" | "full";
}

export interface GenerateResponse {
  description: string;
  title?: string;
  short?: string;
  credits?: { trialCredits: number; paidCredits: number; total: number };
}

export const generateDescription = async (
  params: GenerateParams
): Promise<GenerateResponse> => {
  const res = await fetch("/api/ai-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: params.input,
      templateId: params.templateId ?? "default",
      outputFormat: params.outputFormat ?? "simple",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Błąd generowania");
  }

  return data;
};
