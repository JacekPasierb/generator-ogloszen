"use client";

import {useEffect, useId, useRef, useState} from "react";
import styles from "./ModalRegulamin.module.css";

export default function RegulaminModal() {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);

      // focus trap
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // focus na X
    requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>(`.${styles.closeBtn}`)
        ?.focus();
    });

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        className={styles.regulaminLink}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-label="Otwórz regulamin"
      >
        Regulamin
      </span>

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
          role="presentation"
        >
          <div
            ref={dialogRef}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                Regulamin świadczenia usług
              </h2>
              <p className={styles.subtitle}>
                Skrót najważniejszych zasad. Pełna wersja dostępna na stronie.
              </p>

              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Zamknij"
                title="Zamknij"
              >
                ×
              </button>
            </header>

            <section className={styles.content}>
              <p>
                Serwis <strong>generator-ogloszen.com</strong> umożliwia
                generowanie opisów ogłoszeń przy użyciu sztucznej inteligencji
                (AI).
              </p>

              <p>
                Rejestracja konta w Serwisie jest <strong>darmowa</strong>.
              </p>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Pakiety płatne</h3>
                <ul className={styles.list}>
                  <li>
                    Dostępne pakiety: <strong>START</strong>,{" "}
                    <strong>STANDARD</strong>, <strong>PRO</strong>.
                  </li>
                  <li>
                    Każdy pakiet posiada określony{" "}
                    <strong>limit zapytań</strong>.
                  </li>
                  <li>
                    Po wyczerpaniu limitu wymagany jest zakup kolejnego pakietu.
                  </li>
                  <li>Płatności realizowane są jednorazowo przez Stripe.</li>
                </ul>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Odpowiedzialność</h3>
                <p className={styles.m0}>
                  Wygenerowane treści mają charakter pomocniczy. Użytkownik
                  powinien je zweryfikować przed publikacją.
                </p>
              </div>

              <div className={styles.note}>
                <strong className={styles.noteTitle}>Prawo odstąpienia</strong>
                <p className={styles.m0}>
                  Zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta,
                  po rozpoczęciu świadczenia usługi Użytkownik może utracić
                  prawo do odstąpienia od umowy.
                </p>
              </div>

              <footer className={styles.footer}>
                <span className={styles.meta}>
                  Data ostatniej aktualizacji: <strong>26.05.2025</strong>
                </span>

                <a href="/regulamin" className={styles.link}>
                  Zobacz pełny regulamin →
                </a>
              </footer>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
