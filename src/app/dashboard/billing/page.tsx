"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { plans, type PlanId } from "@/app/data/plans";

export default function BillingPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planId = sp.get("plan") as PlanId | null;

  const plan = useMemo(() => {
    if (!planId) return null;
    return plans.find((p) => p.id === planId) ?? null;
  }, [planId]);

  useEffect(() => {
    if (!planId) setError("Brak planu w adresie URL.");
    else if (!plan) setError("Nieprawidłowy plan.");
    else setError(null);
  }, [planId, plan]);

  const startCheckout = async () => {
    if (!plan) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });

      const data: { url?: string; error?: string } = await res.json();

      if (!res.ok) throw new Error(data.error || "Błąd płatności");
      if (!data.url) throw new Error("Brak URL do płatności");

      window.location.href = data.url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Nieznany błąd");
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="container section">
        <h2>Wybór pakietu</h2>
        <p>{error ?? "Wybierz pakiet na stronie dashboard."}</p>

        <button onClick={() => router.replace("/dashboard")} style={{ padding: 12 }}>
          Wróć
        </button>
      </div>
    );
  }

  return (
    <div className="container section">
      <h2>Aktywacja pakietu: {plan.name}</h2>
      <p>
        Kwota: <strong>{plan.price} zł</strong> (jednorazowo) • Limit:{" "}
        <strong>{plan.aiLimit}</strong> opisów
      </p>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <button onClick={startCheckout} disabled={loading} style={{ padding: 12 }}>
        {loading ? "Przekierowuję do płatności..." : `Zapłać ${plan.price} zł`}
      </button>
    </div>
  );
}
