"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteNav from "../ui/SiteNav/SiteNav";
import LoginForm from "../components/LoginForm/LoginForm";
import { useUser } from "../hooks/useUser";
import Loading from "../components/Loading/Loading";
import styles from "./Login.module.css";

const LoginPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  if (user === undefined || loading) return <Loading />;
  if (user) return null;

  return (
    <div className={styles.page}>
      <SiteNav />

      <main className={styles.main}>
        <div className={styles.split}>
          <aside className={styles.panel}>
            <p className={styles.eyebrow}>Generator Ogłoszeń</p>
            <h1 className={styles.panelTitle}>
              Witaj z powrotem.
              <br />
              <span className={styles.panelAccent}>Twórz opisy w sekundy.</span>
            </h1>
            <p className={styles.panelText}>
              Zaloguj się i wróć do generowania opisów ze zdjęcia lub słów
              kluczowych — OLX, Vinted, Marketplace.
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
                Twój plan i limity w jednym miejscu
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
                Generowanie ze zdjęcia i szablony branżowe
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
                Kopiuj i wklejaj gotowe teksty od razu
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
              <h2 className={styles.formTitle}>Zaloguj się</h2>
              <p className={styles.formSupport}>
                Wróć do konta i generuj kolejne opisy.
              </p>

              <LoginForm />

              <p className={styles.switch}>
                Nie masz konta?{" "}
                <Link href="/register" className={styles.switchLink}>
                  Załóż je za darmo
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
