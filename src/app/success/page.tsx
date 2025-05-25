// app/success/page.tsx
"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";

const SuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    const activatePro = async () => {
      try {
        const res = await fetch("/api/activate", {method: "POST"});
        const data = await res.json();

        if (res.ok) {
          toast.success("Dziękujemy za zakup pakietu AI!");
        } else {
          toast.error("Błąd aktywacji pakietu: " + data.error);
        }
      } catch (err) {
        console.error(err);
        toast.error("Błąd połączenia z serwerem.");
      }
    };

    setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    activatePro();
  }, [router]);

  return (
    <section className="section container">
      <h2>Płatność zakończona sukcesem 🎉</h2>
      <p>Za chwilę zostaniesz przeniesiony do panelu użytkownika.</p>
    </section>
  );
};

export default SuccessPage;
