import React from "react";
import styles from "./Generator.module.css";
import Title from "../../components/Title/Title";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import { useUser } from "../../hooks/useUser";

const Generator = () => {
  const { isPro } = useUser();

  return (
    <section className={`section container ${styles.generatorWrapper}`}>
      <Title>Stwórz opis AI</Title>

      {isPro ? (
        <FormGenerator />
      ) : (
        <div className={styles.lockedBox}>
          <div className={styles.lockedIcon}>🔒</div>
          <h2 className={styles.lockedTitle}>Dostęp z Pakietem AI</h2>

          <p className={styles.lockedText}>
            Generator opisów AI jest dostępny po odblokowaniu Pakietu AI. To
            tylko kilka kliknięć.
          </p>

          <ul className={styles.lockedList}>
            <li>✨ 50 profesjonalnych opisów produktów</li>
            <li>🚀 Styl marketingowy, gotowy do wstawienia</li>
            <li>🧾 Biblioteka wygenerowanych opisów w panelu</li>
          </ul>

          <p className={styles.lockedHint}>
            Po zakupie Pakietu AI w tym miejscu pojawi się formularz, w którym
            wpiszesz kilka słów o produkcie, a resztę zrobi AI.
          </p>
        </div>
      )}
    </section>
  );
};

export default Generator;
