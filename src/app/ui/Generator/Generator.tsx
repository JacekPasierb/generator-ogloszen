import React from "react";
import styles from "./Generator.module.css";
import Title from "../../components/Title/Title";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import { useUser } from "../../hooks/useUser";
import CardProduct from "../../components/CardProduct/CardProduct";

const Generator = () => {
  const {  isPaid } = useUser();

  return (
    <section
      className={`section container ${styles.generatorWrapper} ${
        isPaid ? styles.pro : styles.free
      }`}
    >
      <div className={styles.heading}>
        <Title>Stwórz opis AI</Title>
        <p className={styles.subTitle}>
          Wpisz kilka informacji — dostaniesz gotowy opis sprzedażowy.
        </p>
      </div>

      {isPaid ? (
        <div className={styles.proCard} data-plan="pro">
          <FormGenerator />
        </div>
      ) : (
        <>
          <div className={styles.lockedBox}>
            <div className={styles.lockedIcon}>🔒</div>
            <h2 className={styles.lockedTitle}>Odblokuj Generator Opisów</h2>

            <p className={styles.lockedText}>
              Generator opisów AI jest dostępny po aktywacji pakietu. Płatność
              jest jednorazowa – bez subskrypcji.
            </p>
          </div>

          <div className={styles.pricingWrap}>
            <CardProduct mode="dashboard" />
          </div>
        </>
      )}
    </section>
  );
};

export default Generator;
