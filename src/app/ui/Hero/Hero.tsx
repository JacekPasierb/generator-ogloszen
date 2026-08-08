"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import styles from "./Hero.module.css";
import { useUser } from "../../hooks/useUser";

const DEMO_KEYWORDS = "rower górski · 2022 · mało używany · Warszawa";
const DEMO_OUTPUT =
  "Sprzedam rower górski z 2022 roku — stan prawie nowy, regularnie serwisowany. Idealny na trasy i codzienne dojazdy. Odbiór osobisty w Warszawie. Zapraszam do kontaktu!";

const Hero = () => {
  const { user } = useUser();
  const isAuthed = Boolean(user);
  const authReady = user !== undefined;

  const [typedKeywords, setTypedKeywords] = useState("");
  const [typedOutput, setTypedOutput] = useState("");
  const [phase, setPhase] = useState<"keywords" | "pause" | "output" | "done">(
    "keywords"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "keywords") {
      if (typedKeywords.length < DEMO_KEYWORDS.length) {
        timeout = setTimeout(() => {
          setTypedKeywords(DEMO_KEYWORDS.slice(0, typedKeywords.length + 1));
        }, 28);
      } else {
        timeout = setTimeout(() => setPhase("pause"), 600);
      }
    }

    if (phase === "pause") {
      timeout = setTimeout(() => setPhase("output"), 400);
    }

    if (phase === "output") {
      if (typedOutput.length < DEMO_OUTPUT.length) {
        timeout = setTimeout(() => {
          setTypedOutput(DEMO_OUTPUT.slice(0, typedOutput.length + 1));
        }, 12);
      } else {
        timeout = setTimeout(() => setPhase("done"), 2800);
      }
    }

    if (phase === "done") {
      timeout = setTimeout(() => {
        setTypedKeywords("");
        setTypedOutput("");
        setPhase("keywords");
      }, 1200);
    }

    return () => clearTimeout(timeout);
  }, [phase, typedKeywords, typedOutput]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.heroRoot}>
      <header className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <div className={styles.navInner}>
          <Link
            href={isAuthed ? "/dashboard" : "/"}
            className={styles.brand}
            onClick={closeMenu}
          >
            <Image
              src="/logo.png"
              width={40}
              height={40}
              alt=""
              className={styles.brandMark}
              priority
            />
            <span className={styles.brandName}>Generator Ogłoszeń</span>
          </Link>

          <nav className={styles.desktopLinks} aria-label="Główne">
            <a href="#pricing" className={styles.navLink}>
              Cennik
            </a>
            <a href="#examples" className={styles.navLink}>
              Przykłady
            </a>
            {authReady &&
              (isAuthed ? (
                <>
                  <Link href="/dashboard/billing" className={styles.navLink}>
                    Konto
                  </Link>
                  <Link href="/dashboard" className={styles.navCta}>
                    Generator
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.navLink}>
                    Zaloguj
                  </Link>
                  <Link href="/register" className={styles.navCta}>
                    Zacznij za darmo
                  </Link>
                </>
              ))}
          </nav>

          <button
            type="button"
            className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ""}`}
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={menuOpen}
            aria-controls="hero-mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
          </button>
        </div>
      </header>

      {mounted &&
        createPortal(
          <>
            <div
              className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ""}`}
              onClick={closeMenu}
              aria-hidden={!menuOpen}
            />
            <nav
              id="hero-mobile-menu"
              className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
              aria-label="Menu mobilne"
              aria-hidden={!menuOpen}
            >
              <div className={styles.drawerInner}>
                <div className={styles.drawerHead}>
                  <p className={styles.drawerEyebrow}>Nawigacja</p>
                  <p className={styles.drawerTitle}>Generator Ogłoszeń</p>
                </div>
                <div className={styles.drawerNav}>
                  <a
                    href="#pricing"
                    className={styles.drawerLink}
                    onClick={closeMenu}
                  >
                    <span className={styles.drawerLinkMain}>Cennik</span>
                    <span className={styles.drawerLinkSub}>
                      Jednorazowe pakiety, bez subskrypcji
                    </span>
                  </a>
                  <a
                    href="#examples"
                    className={styles.drawerLink}
                    onClick={closeMenu}
                  >
                    <span className={styles.drawerLinkMain}>Przykłady</span>
                    <span className={styles.drawerLinkSub}>
                      Zobacz gotowe opisy
                    </span>
                  </a>
                  {authReady &&
                    (isAuthed ? (
                      <Link
                        href="/dashboard/billing"
                        className={styles.drawerLink}
                        onClick={closeMenu}
                      >
                        <span className={styles.drawerLinkMain}>Konto</span>
                        <span className={styles.drawerLinkSub}>
                          Plan, kredyty i aktywność
                        </span>
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className={styles.drawerLink}
                        onClick={closeMenu}
                      >
                        <span className={styles.drawerLinkMain}>Zaloguj</span>
                        <span className={styles.drawerLinkSub}>
                          Wróć do workspace
                        </span>
                      </Link>
                    ))}
                </div>
                <div className={styles.drawerFoot}>
                  {authReady &&
                    (isAuthed ? (
                      <Link
                        href="/dashboard"
                        className={styles.drawerCta}
                        onClick={closeMenu}
                      >
                        Otwórz generator
                      </Link>
                    ) : (
                      <Link
                        href="/register"
                        className={styles.drawerCta}
                        onClick={closeMenu}
                      >
                        Zacznij za darmo
                      </Link>
                    ))}
                </div>
              </div>
            </nav>
          </>,
          document.body
        )}

      <section className={styles.hero} aria-label="Hero">
        <div className={styles.atmosphere} aria-hidden />
        <div className={styles.grid} aria-hidden />

        <div className={styles.stage}>
          <div className={styles.copy}>
            <p className={styles.brandHero}>Generator Ogłoszeń</p>
            <h1 className={styles.headline}>
              Słowa kluczowe.
              <br />
              <span className={styles.headlineAccent}>Gotowe ogłoszenie.</span>
            </h1>
            <p className={styles.support}>
              Wpisz kilka faktów o produkcie — AI napisze opis, który sprzedaje
              na OLX, Vinted i Marketplace.
            </p>

            <div className={styles.ctaGroup}>
              {isAuthed ? (
                <Link href="/dashboard" className={styles.ctaPrimary}>
                  Otwórz generator
                </Link>
              ) : (
                <>
                  <Link href="/register" className={styles.ctaPrimary}>
                    Wygeneruj pierwszy opis
                  </Link>
                  <Link href="/login" className={styles.ctaSecondary}>
                    Mam już konto
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className={styles.visual} aria-hidden="true">
            <div className={styles.visualPlane}>
              <div className={styles.visualLabel}>Słowa kluczowe</div>
              <p className={styles.visualKeywords}>
                {typedKeywords}
                <span
                  className={`${styles.caret} ${
                    phase === "keywords" ? styles.caretBlink : ""
                  }`}
                />
              </p>

              <div
                className={`${styles.visualDivider} ${
                  phase === "output" || phase === "done" || phase === "pause"
                    ? styles.visualDividerActive
                    : ""
                }`}
              />

              <div className={styles.visualLabel}>Opis sprzedażowy</div>
              <p className={styles.visualOutput}>
                {typedOutput}
                <span
                  className={`${styles.caret} ${
                    phase === "output" ? styles.caretBlink : ""
                  }`}
                />
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
