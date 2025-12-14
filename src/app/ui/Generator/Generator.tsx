import React from "react";
import styles from "./Generator.module.css";
import Title from "../../components/Title/Title";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import {useUser} from "../../hooks/useUser";
import CardProduct from "../../components/CardProduct/CardProduct";

const Generator = () => {
  const {isPaid} = useUser();

  return (
    <section
      className={`section container ${styles.generatorWrapper} ${
        isPaid ? styles.pro : styles.free
      }`}
    >
      <div className={styles.heading}>
        <Title>{!isPaid ? "Generator opisów AI" : " Stwórz opis AI"}</Title>
        {isPaid && (
          <p className={styles.subTitle}>
            Wpisz kilka informacji — dostaniesz gotowy opis sprzedażowy.
          </p>
        )}
      </div>

      {isPaid ? (
        <div className={styles.proCard} data-plan="pro">
          <FormGenerator />
        </div>
      ) : (
        <>
          <div className={styles.lockedBox}>
            <div className={styles.lockedIcon}>🔒</div>
            <h2 className={styles.lockedTitle}>
              Generator opisów jest zablokowany
            </h2>

            <p className={styles.lockedText}>
              Wykup pakiet, aby generować opisy AI i zapisywać je do schowka.
              Płatność jest jednorazowa – bez subskrypcji.
            </p>
            <a href="#pricing" className={styles.unlockBtn}>
              Sprawdź pakiety
            </a>
          </div>

          <div className={styles.pricingWrap} id="pricing">
            <CardProduct mode="dashboard" />
          </div>
        </>
      )}
    </section>
  );
};

export default Generator;
