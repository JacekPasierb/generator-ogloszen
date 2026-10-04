"use client";

import React, { useState } from "react";
import styles from "./Generator.module.css";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import { useUser } from "../../hooks/useUser";
import CardProduct from "../../components/CardProduct/CardProduct";
import PaywallModal from "../../components/PaywallModal/PaywallModal";
import { resetPlan } from "../../services/planService";

const Generator = () => {
  const { isPaid, plan, aiLeft, trialCredits, totalCredits, mutate } =
    useUser();
  const [isRenewing, setIsRenewing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleRenew = async () => {
    if (isRenewing) return;
    setIsRenewing(true);

    try {
      await resetPlan();
      await mutate();
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
  const planLabel = isPaid
    ? plan.charAt(0).toUpperCase() + plan.slice(1)
    : trialCredits > 0
      ? "Trial"
      : "Free";

  return (
    <section className={`container ${styles.generator}`}>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderMain}>
          <p className={styles.eyebrow}>Generator</p>
          <h1 className={styles.title}>
            {!canGenerate
              ? "Odblokuj generator"
              : isExhausted
                ? "Pakiet wyczerpany"
                : "Nowe ogłoszenie"}
          </h1>
          {canGenerate && !isExhausted && (
            <p className={styles.subTitle}>
              Portal → treść → publikacja. Jeden kredyt na generację.
            </p>
          )}
          {isExhausted && (
            <p className={styles.subTitle}>
              Limit w tym pakiecie wykorzystany. Odnów dostęp, aby kontynuować.
            </p>
          )}
          {!canGenerate && (
            <p className={styles.subTitle}>
              Jednorazowe pakiety kredytów — bez subskrypcji.
            </p>
          )}
        </div>

        {hasAnyCredits && !isExhausted && (
          <aside className={styles.creditBar} aria-label="Kredyty">
            <span className={styles.planPill} data-plan={planLabel.toLowerCase()}>
              {planLabel}
            </span>
            <div className={styles.creditStats}>
              {trialCredits > 0 && (
                <div className={styles.creditStat}>
                  <span className={styles.creditLabel}>Trial</span>
                  <span className={styles.creditValue}>{trialCredits}</span>
                </div>
              )}
              {aiLeft > 0 && (
                <div className={styles.creditStat}>
                  <span className={styles.creditLabel}>Pakiet</span>
                  <span className={styles.creditValue}>{aiLeft}</span>
                </div>
              )}
            </div>
          </aside>
        )}
      </header>

      {canGenerate ? (
        isExhausted ? (
          <div className={styles.statePanel}>
            <h2 className={styles.stateTitle}>Czas na kolejny pakiet</h2>
            <p className={styles.stateText}>
              Odnów dostęp, aby wrócić do wyboru Start, Standard lub Pro.
            </p>
            <button
              type="button"
              onClick={handleRenew}
              disabled={isRenewing}
              className={styles.primaryBtn}
            >
              {isRenewing ? "Odnawiam…" : "Odnów pakiet"}
            </button>
          </div>
        ) : (
          <div className={styles.workspace}>
            <FormGenerator onNoCredits={() => setShowPaywall(true)} />
          </div>
        )
      ) : (
        <>
          <div className={styles.statePanel}>
            <h2 className={styles.stateTitle}>Generator jest zablokowany</h2>
            <p className={styles.stateText}>
              Wykup pakiet, aby generować opisy AI. Płatność jednorazowa — bez
              abonamentu.
            </p>
            <a href="#pricing" className={styles.primaryBtn}>
              Sprawdź pakiety
            </a>
          </div>

          <div className={styles.pricingWrap} id="pricing">
            <CardProduct mode="dashboard" />
          </div>
        </>
      )}

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
