"use client";

import {useEffect} from "react";
import {useSearchParams} from "next/navigation";
import {toast} from "react-toastify";
import {useUser} from "../../hooks/useUser";

const SessionHandler = () => {
  const searchParams = useSearchParams();
  const {mutate} = useUser();
  const sessionId = searchParams.get("session_id");
  const cancelled = searchParams.get("cancelled");

  useEffect(() => {
    if (cancelled) {
      toast.info("Płatność została anulowana.");
      window.history.replaceState(null, "", "/dashboard");
    }
  }, [cancelled]);

  useEffect(() => {
    const activatePro = async () => {
      if (!sessionId) return;
      try {
        const res = await fetch(`/api/verify-checkout?session_id=${sessionId}`);
        const data = await res.json();

        if (res.ok && data.paid) {
          toast.success("Dziękujemy za zakup pakietu AI!");
          mutate();
          window.history.replaceState(null, "", "/dashboard");
        } else {
          toast.error("Błąd aktywacji pakietu: " + data.error);
        }
      } catch (err) {
        console.error(err);
        toast.error("Błąd połączenia z serwerem.");
      }
    };

    activatePro();
  }, [sessionId, mutate]);

  return null;
};

export default SessionHandler;
