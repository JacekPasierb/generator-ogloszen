export const fetchDescription = async () => {
  const res = await fetch("/api/descriptions");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Błąd pobierania opisów");
  }

  return data.descriptions;
};

export const saveDescription = async (description: string) => {
  const res = await fetch("/api/descriptions", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({description}),
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
