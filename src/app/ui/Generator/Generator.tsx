import React from "react";
import styles from "./Generator.module.css";
import Title from "../../components/Title/Title";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import { useUser } from "../../hooks/useUser";

const Generator = () => {
  const { isPro } = useUser();

  // Wersja dla użytkownika z Pakietem AI – bez zmian
  if (isPro) {
    return (
      <section className={`section container ${styles.generator}`}>
        <Title>Stwórz opis AI</Title>
        <FormGenerator />
      </section>
    );
  }

  // Wersja dla konta darmowego – wypełniamy ekran treścią
  return (
    <section className={`section container ${styles.generator}`}>
      <Title>Stwórz opis AI</Title>

      <div className={styles.lockedBox}>
        <p className={styles.lockedTitle}>Dostęp z Pakietem AI</p>
        <p className={styles.lockedText}>
          Generator opisów AI jest dostępny po odblokowaniu Pakietu AI.
        </p>

        <ul className={styles.lockedList}>
          <li>✨ 50 gotowych, marketingowych opisów ogłoszeń</li>
          <li>🚀 Teksty dopasowane do OLX, Vinted i Marketplace</li>
          <li>🧾 Historia wygenerowanych opisów w panelu</li>
          <li>🔄 Możliwość edycji i kopiowania opisów jednym kliknięciem</li>
        </ul>

        <p className={styles.lockedHint}>
          Po zakupie Pakietu AI w tym miejscu pojawi się formularz, w którym
          wpiszesz kilka słów o produkcie, a aplikacja wygeneruje gotowy opis.
        </p>
      </div>
    </section>
  );
};

export default Generator;
