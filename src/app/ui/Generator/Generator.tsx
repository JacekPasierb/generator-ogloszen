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

  return (
    <section className={`section container ${styles.generator}`}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Workspace</p>
        <h1 className={styles.title}>
          {!canGenerate
            ? "Odblokuj generator opisów"
            : isExhausted
              ? "Pakiet wyczerpany"
              : "Słowa kluczowe. Gotowe ogłoszenie."}
        </h1>

        {canGenerate && !isExhausted && (
          <p className={styles.subTitle}>
            Wpisz cechy oferty lub dodaj zdjęcie — AI zbuduje sprzedażowy opis
            pod OLX, Marketplace i social.
          </p>
        )}

        {isExhausted && (
          <p className={styles.subTitle}>
            Limit opisów w tym pakiecie został wykorzystany. Odnów dostęp i
            wybierz kolejny pakiet.
          </p>
        )}

        {!canGenerate && (
          <p className={styles.subTitle}>
            Jednorazowe pakiety kredytów — bez subskrypcji. Generuj, kopiuj,
            publikuj.
          </p>
        )}

        {hasAnyCredits && !isExhausted && (
          <div className={styles.metaRow}>
            {trialCredits > 0 && (
              <span className={styles.metaChip} data-tone="trial">
                Trial · {trialCredits}
              </span>
            )}
            {aiLeft > 0 && (
              <span className={styles.metaChip} data-tone="paid">
                Pakiet · {aiLeft}
              </span>
            )}
          </div>
        )}
      </div>

      {canGenerate ? (
        isExhausted ? (
          <div className={styles.statePanel}>
            <span className={styles.stateMark} aria-hidden />
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
          <div
            className={styles.workspace}
            data-plan={isPaid ? plan : trialCredits > 0 ? "trial" : "free"}
          >
            <div className={styles.workspaceTop}>
              <span className={styles.workspaceLabel}>Nowe ogłoszenie</span>
              <span className={styles.workspaceBadge}>
                {isPaid
                  ? plan.charAt(0).toUpperCase() + plan.slice(1)
                  : trialCredits > 0
                    ? "Trial"
                    : "Free"}
              </span>
            </div>
            <FormGenerator onNoCredits={() => setShowPaywall(true)} />
          </div>
        )
      ) : (
        <>
          <div className={styles.statePanel}>
            <span className={styles.stateMark} data-tone="locked" aria-hidden />
            <h2 className={styles.stateTitle}>Generator jest zablokowany</h2>
            <p className={styles.stateText}>
              Wykup pakiet, aby generować opisy AI i zapisywać je do schowka.
              Płatność jednorazowa — bez abonamentu.
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
