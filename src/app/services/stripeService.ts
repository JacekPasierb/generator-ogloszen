export const verifyPaid = async (sessionId: string | null) => {
  const res = await fetch("/api/verify-checkout", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({session_id: sessionId}),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Błąd zapisu opisu");
  }
  return data;
};
