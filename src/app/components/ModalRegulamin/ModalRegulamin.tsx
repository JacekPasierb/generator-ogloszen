"use client";

import {useState} from "react";
import styles from "./ModalRegulamin.module.css";

export default function RegulaminModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span onClick={() => setIsOpen(true)} className={styles.regulaminLink}>
        Regulamin
      </span>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
            <h2>Regulamin świadczenia usług</h2>
            <p>
              Właścicielem serwisu jest osoba fizyczna prowadząca działalność
              nierejestrowaną.
            </p>
            <p>Serwis umożliwia generowanie opisów ogłoszeń przy pomocy AI.</p>
            <p>
              Usługa dostępna jest w ramach pakietów płatnych, płatności
              obsługuje Stripe.
            </p>
            <p>Użytkownik ponosi odpowiedzialność za wykorzystanie opisów.</p>
            <p>
              Po zakupie pakietu użytkownik traci prawo do odstąpienia od umowy.
            </p>
            <p>Zmiany regulaminu będą publikowane na stronie.</p>
            <p style={{fontSize: "0.9rem", marginTop: "1rem", color: "#888"}}>
              Data ostatniej aktualizacji: [tu wpisz datę]
            </p>
          </div>
        </div>
      )}
    </>
  );
}
