"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useUser, type MeResponse, type UserResponse } from "../../hooks/useUser";

const isUser = (data: MeResponse | undefined): data is UserResponse =>
  !!data && !("error" in data);

const SessionHandler = () => {
  const searchParams = useSearchParams();
  const { mutate } = useUser();

  const sessionId = searchParams.get("session_id");
  const cancelled = searchParams.get("cancelled");

  const startedRef = useRef(false);
  const toastIdRef = useRef<ReturnType<typeof toast.info> | null>(null);

  useEffect(() => {
    if (!cancelled) return;

    toast.info("Płatność została anulowana.");
    window.history.replaceState(null, "", "/dashboard");
  }, [cancelled]);

  useEffect(() => {
    if (!sessionId) return;
    if (startedRef.current) return;
    startedRef.current = true;

    toastIdRef.current = toast.info("Płatność zakończona. Aktywuję pakiet…", {
      autoClose: false,
    });

    let tries = 0;
    const maxTries = 12;

    const interval = setInterval(async () => {
      tries += 1;

      // ✅ bierzemy świeże dane z mutate()
      const data = (await mutate()) as MeResponse | undefined;

      if (isUser(data) && data.plan !== "free") {
        clearInterval(interval);

        if (toastIdRef.current) toast.dismiss(toastIdRef.current);
        toast.success("Pakiet aktywny ✅");

        window.history.replaceState(null, "", "/dashboard");
        return;
      }

      if (tries >= maxTries) {
        clearInterval(interval);

        if (toastIdRef.current) toast.dismiss(toastIdRef.current);
        toast.warn("Jeszcze chwila… jeśli się nie aktywuje, odśwież stronę.");

        window.history.replaceState(null, "", "/dashboard");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, mutate]);

  return null;
};

export default SessionHandler;
