export const resetPlan = async () => {
    const res = await fetch("/api/plan/reset", { method: "POST" });
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.error || "Nie udało się zresetować pakietu");
    }
  
    return data;
  };
  