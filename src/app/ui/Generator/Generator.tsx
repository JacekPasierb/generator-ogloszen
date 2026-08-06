import React, { useState, useEffect } from "react";
import styles from "./Generator.module.css";
import Title from "../../components/Title/Title";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import { useUser } from "../../hooks/useUser";
import CardProduct from "../../components/CardProduct/CardProduct";
import PaywallModal from "../../components/PaywallModal/PaywallModal";
import { resetPlan } from "../../services/planService";


const Generator = () => {
  const { isPaid, aiLeft, trialCredits, totalCredits, mutate } = useUser();
  const [isRenewing, setIsRenewing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Pokaż paywall jeśli użytkownik próbuje wygenerować bez kredytów
  useEffect(() => {
    if (totalCredits === 0 && !isPaid) {
      // Paywall pokaże się automatycznie przy próbie generowania
    }
  }, [totalCredits, isPaid]);

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

  const handleSelectPlan = async (planId: string) => {
    try {
      const res = await fetch("/api/checkout-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Nie udało się rozpocząć płatności");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Błąd płatności. Spróbuj ponownie.");
    }
  };

  const isExhausted = isPaid && aiLeft <= 0;
  const hasAnyCredits = totalCredits > 0;
  const canGenerate = hasAnyCredits || isPaid;

  return (
    <section
      className={`section container ${styles.generatorWrapper} ${
        isPaid ? styles.pro : styles.free
      }`}
    >
      {/* HEADING */}
      <div className={styles.heading}>
        <Title>
          {!canGenerate ? "Generator opisów AI" : "Stwórz opis AI"}
        </Title>

        {canGenerate && !isExhausted && (
          <p className={styles.subTitle}>
            Wpisz kilka informacji — dostaniesz gotowy opis sprzedażowy.
          </p>
        )}

        {isExhausted && (
          <p className={styles.subTitle}>
            Twój pakiet został wykorzystany. Możesz odnowić dostęp i wybrać kolejny pakiet.
          </p>
        )}

        {/* Liczniki kredytów */}
        {hasAnyCredits && (
          <div className={styles.creditsInfo}>
            {trialCredits > 0 && (
              <span className={styles.creditBadge} data-type="trial">
                🎁 {trialCredits} {trialCredits === 1 ? "kredyt testowy" : "kredyty testowe"}
              </span>
            )}
            {aiLeft > 0 && (
              <span className={styles.creditBadge} data-type="paid">
                💎 {aiLeft} {aiLeft === 1 ? "kredyt" : "kredytów"} płatnych
              </span>
            )}
          </div>
        )}
      </div>

      {/* STANY */}
      {canGenerate ? (
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
          <div className={styles.proCard} data-plan={isPaid ? "pro" : "free"}>
            <FormGenerator 
              onNoCredits={() => setShowPaywall(true)}
            />
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

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onSelectPlan={handleSelectPlan}
        />
      )}
    </section>
  );
};

export default Generator;
