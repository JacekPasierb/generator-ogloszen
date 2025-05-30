"use client";

import {useEffect, useState} from "react";
import styles from "./ModalRegulamin.module.css";

export default function RegulaminModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <span
        onClick={() => setIsOpen(true)}
        className={styles.regulaminLink}
        aria-label="Zobacz regulamin"
        title="Zobacz regulamin"
      >
        Regulamin
      </span>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="regulamin-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Zamknij modal z regulaminem"
              title="Zamknij"
            >
              ×
            </button>
            <h2>Regulamin świadczenia usług</h2>
            <p>
              Właścicielem serwisu jest osoba fizyczna prowadząca działalność
              nierejestrowaną.
            </p>
            <p>
              Serwis umożliwia generowanie opisów ogłoszeń przy pomocy sztucznej
              inteligencji (AI).
            </p>
            <p>
              Usługa dostępna jest w ramach pakietów płatnych. Płatności
              realizowane są za pośrednictwem operatora Stripe.
            </p>
            <p>
              Użytkownik ponosi pełną odpowiedzialność za sposób wykorzystania
              wygenerowanych opisów.
            </p>
            <p>
              Zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta, po
              zakupie pakietu użytkownik traci prawo do odstąpienia od umowy,
              ponieważ usługa jest w pełni realizowana z chwilą zakupu.
            </p>
            <p>
              Aktualizacje niniejszego regulaminu będą publikowane na stronie.
            </p>
            <p style={{fontSize: "0.9rem", marginTop: "1rem", color: "#888"}}>
              Data ostatniej aktualizacji: 26.05.2025
            </p>
          </div>
        </div>
      )}
    </>
  );
}
