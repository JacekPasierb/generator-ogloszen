"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("s",sessionId);
    
    const activatePro = async () => {
      if (!sessionId) {
       
        router.replace("/"); 
        return;
      }

      try {
        const res = await fetch(`/api/verify-checkout?session_id=${sessionId}`);
        const data = await res.json();
console.log("sesionId",sessionId);
console.log("data",data.paid);

        if (res.ok && data.paid) {
          toast.success("Dziękujemy za zakup pakietu AI!");
        } else {
          toast.error("Błąd aktywacji pakietu: " + data.error);
        }

        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } catch (err) {
        console.error(err);
        toast.error("Błąd połączenia z serwerem.");
      } finally {
        setLoading(false);
      }
    };

    activatePro();
  }, [router, sessionId]);

  if (loading) return <p className="section container">Trwa weryfikacja płatności...</p>;

  return (
    <section className="section container">
      <h2>Płatność zakończona sukcesem 🎉</h2>
      <p>Za chwilę zostaniesz przeniesiony do panelu użytkownika.</p>
    </section>
  );
};

export default SuccessPage;
