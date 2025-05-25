// app/success/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const SuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    toast.success("Dziękujemy za zakup pakietu AI!");
    setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
  }, [router]);

  return (
    <section className="section container">
      <h2>Płatność zakończona sukcesem 🎉</h2>
      <p>Za chwilę zostaniesz przeniesiony do panelu użytkownika.</p>
    </section>
  );
};

export default SuccessPage;
