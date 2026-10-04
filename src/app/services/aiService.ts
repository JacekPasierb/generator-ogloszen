export interface ListingVariant {
  label: string;
  title: string;
  long: string;
}

export interface GenerateParams {
  input: string;
  templateId?: string;
  portalId?: string;
  outputFormat?: "simple" | "full";
  /** @deprecated prefer imageDataUrls */
  imageDataUrl?: string;
  imageDataUrls?: string[];
  variants?: boolean;
}

export interface GenerateResponse {
  description: string;
  title?: string;
  short?: string;
  keywords?: string[];
  features?: string[];
  checklist?: string[];
  variants?: ListingVariant[];
  credits?: { trialCredits: number; paidCredits: number; total: number };
}

export type RewriteMode =
  | "shorter"
  | "stronger_cta"
  | "formal"
  | "no_emoji";

export const generateDescription = async (
  params: GenerateParams
): Promise<GenerateResponse> => {
  const imageDataUrls =
    params.imageDataUrls?.filter(Boolean) ??
    (params.imageDataUrl ? [params.imageDataUrl] : undefined);

  const res = await fetch("/api/ai-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: params.input,
      templateId: params.templateId ?? "default",
      portalId: params.portalId ?? "olx",
      outputFormat: params.outputFormat ?? "simple",
      imageDataUrls,
      variants: params.variants === true,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Błąd generowania");
  }

  return data;
};

export const rewriteDescription = async (params: {
  text: string;
  mode: RewriteMode;
  title?: string;
}): Promise<{ description: string; title?: string }> => {
  const res = await fetch("/api/ai-rewrite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: params.text,
      mode: params.mode,
      title: params.title,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Błąd poprawiania opisu");
  }
  return data;
};
