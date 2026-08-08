export const fetchDescription = async () => {
  const res = await fetch("/api/descriptions");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Błąd pobierania opisów");
  }

  return data.descriptions;
};

export type SaveDescriptionPayload = {
  description: string;
  title?: string;
  short?: string;
};

export const saveDescription = async (payload: SaveDescriptionPayload | string) => {
  const body =
    typeof payload === "string"
      ? { description: payload }
      : {
          description: payload.description,
          title: payload.title,
          short: payload.short,
        };

  const res = await fetch("/api/descriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Błąd zapisu opisu");
  }

  return data;
};

export const deleteDescription = async (id: string) => {
  const res = await fetch(`/api/descriptions/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Błąd podczas usuwania opisu");
  }
};
