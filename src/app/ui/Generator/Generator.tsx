import React, { useState } from "react";
import styles from "./Generator.module.css";
import Title from "../../components/Title/Title";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import { useUser } from "../../hooks/useUser";
import CardProduct from "../../components/CardProduct/CardProduct";
import { resetPlan } from "../../services/planService";


const Generator = () => {
  const { isPaid, aiLeft, mutate } = useUser();
  const [isRenewing, setIsRenewing] = useState(false);

  const handleRenew = async () => {
    if (isRenewing) return;
    setIsRenewing(true);

    try {
      await resetPlan();
      await mutate(); // odśwież /api/me
      // toast.success("Pakiet został odnowiony. Wybierz nowy pakiet ✅");
    } catch (err) {
      console.error("Błąd odnawiania pakietu:", err);
    } finally {
      setIsRenewing(false);
    }
  };

  const isExhausted = isPaid && aiLeft <= 0;

  return (
    <section
      className={`section container ${styles.generatorWrapper} ${
        isPaid ? styles.pro : styles.free
      }`}
    >
      {/* HEADING */}
      <div className={styles.heading}>
        <Title>
          {!isPaid ? "Generator opisów AI" : "Stwórz opis AI"}
        </Title>

        {isPaid && !isExhausted && (
          <p className={styles.subTitle}>
            Wpisz kilka informacji — dostaniesz gotowy opis sprzedażowy.
          </p>
        )}

        {isExhausted && (
          <p className={styles.subTitle}>
            Twój pakiet został wykorzystany. Możesz odnowić dostęp i wybrać kolejny pakiet.
          </p>
        )}
      </div>

      {/* STANY */}
      {isPaid ? (
        isExhausted ? (
          <div className={styles.exhaustedBox}>
            <div className={styles.exhaustedIcon}>⚡</div>
            <h2 className={styles.exhaustedTitle}>Pakiet wyczerpany</h2>
            <p className={styles.exhaustedText}>
              Wykorzystałeś limit opisów w tym pakiecie. Odnów pakiet, aby przejść do wyboru nowych pakietów.
            </p>

            <button
              type="button"
              onClick={handleRenew}
              disabled={isRenewing}
              className={styles.renewBtn}
            >
              {isRenewing ? "Odnawiam..." : "Odnów pakiet"}
            </button>
          </div>
        ) : (
          <div className={styles.proCard} data-plan="pro">
            <FormGenerator />
          </div>
        )
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
