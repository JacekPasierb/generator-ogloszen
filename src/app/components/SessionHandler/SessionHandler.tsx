"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "../../hooks/useUser";

const SessionHandler = () => {
  const searchParams = useSearchParams();
  const { plan, mutate } = useUser();

  const sessionId = searchParams.get("session_id");
  const cancelled = searchParams.get("cancelled");

  const startedRef = useRef(false);

  // 1) Cancelled
  useEffect(() => {
    if (!cancelled) return;

    toast.info("Płatność została anulowana.");
    window.history.replaceState(null, "", "/dashboard");
  }, [cancelled]);

  // 2) Success (session_id) -> czekamy aż webhook ustawi plan
  useEffect(() => {
    if (!sessionId) return;

    // żeby nie odpalić 2 razy (React StrictMode w dev / rerender)
    if (startedRef.current) return;
    startedRef.current = true;

    toast.info("Płatność zakończona. Aktywuję pakiet…");

    let tries = 0;
    const maxTries = 12; // ~12s

    const interval = setInterval(async () => {
      tries += 1;

      // odśwież usera
      await mutate();

      // jeśli webhook już ustawił plan
      if (plan !== "free") {
        clearInterval(interval);
        toast.success("Pakiet aktywny ✅");
        window.history.replaceState(null, "", "/dashboard");
        return;
      }

      if (tries >= maxTries) {
        clearInterval(interval);
        toast.warn(
          "Jeszcze chwila… jeśli pakiet się nie aktywuje, odśwież stronę."
        );
        window.history.replaceState(null, "", "/dashboard");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, mutate, plan]);

  return null;
};

export default SessionHandler;
