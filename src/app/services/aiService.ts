interface FormValues {
  input: string;
}
export const generateDescription = async (values: FormValues) => {
  const res = await fetch("/api/ai-generate", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({input: values.input}),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Błąd generowania");
  }

  return data;
};
