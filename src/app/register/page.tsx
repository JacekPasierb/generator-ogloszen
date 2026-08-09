"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteNav from "../ui/SiteNav/SiteNav";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import { useUser } from "../hooks/useUser";
import Loading from "../components/Loading/Loading";
import styles from "./Register.module.css";

const RegisterPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || user === undefined) return <Loading />;
  if (user) return null;

  return (
    <div className={styles.page}>
      <SiteNav />

      <main className={styles.main}>
        <div className={styles.split}>
          <aside className={styles.panel} aria-hidden="false">
            <p className={styles.eyebrow}>Generator Ogłoszeń</p>
            <h1 className={styles.panelTitle}>
              Zacznij od zdjęcia.
              <br />
              <span className={styles.panelAccent}>Dostań opis, który sprzedaje.</span>
            </h1>
            <p className={styles.panelText}>
              Załóż konto i wygeneruj pierwsze opisy za darmo — ze zdjęcia lub
              słów kluczowych, na OLX, Vinted i Marketplace.
            </p>

            <ul className={styles.benefits}>
              <li>
                <span className={styles.check} aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7.5L5.5 10.5L11.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                2 darmowe generacje po rejestracji
              </li>
              <li>
                <span className={styles.check} aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7.5L5.5 10.5L11.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Szablony branżowe i generowanie ze zdjęcia
              </li>
              <li>
                <span className={styles.check} aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7.5L5.5 10.5L11.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Jednorazowe pakiety — bez subskrypcji
              </li>
            </ul>
          </aside>

          <section className={styles.formSide}>
            <div className={styles.card}>
              <Image
                src="/logo.png"
                width={48}
                height={48}
                alt=""
                className={styles.logo}
                priority
              />
              <h2 className={styles.formTitle}>Załóż konto</h2>
              <p className={styles.formSupport}>
                Kilka sekund — i możesz wygenerować pierwszy opis.
              </p>

              <RegisterForm />

              <p className={styles.switch}>
                Masz już konto?{" "}
                <Link href="/login" className={styles.switchLink}>
                  Zaloguj się
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
