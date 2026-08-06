import React, {useEffect} from "react";
import styles from "./PaywallModal.module.css";
import {plans} from "../../data/plans";

interface PaywallModalProps {
  onClose: () => void;
  onSelectPlan: (planId: string) => void;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onSelectPlan }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ event: "paywall_view" }),
    }).catch(() => {});
  }, []);

  const handleSelectPlan = (planId: string) => {
    onSelectPlan(planId);
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Wybierz pakiet"
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Wybierz pakiet</h2>
            <p className={styles.subtitle}>
              Wykorzystałeś wszystkie darmowe kredyty testowe
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Zamknij"
            title="Zamknij"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>
            Dziękujemy za wypróbowanie! Aby kontynuować generowanie opisów,
            wybierz jeden z pakietów poniżej.
          </p>

          <div className={styles.plansGrid}>
            {plans.map((plan) => {
              const hasBadge = Boolean(plan.badge);
              return (
                <div
                  key={plan.id}
                  className={`${styles.planCard} ${
                    hasBadge ? styles.featured : ""
                  }`}
                >
                  {hasBadge && (
                    <div className={styles.badge}>{plan.badge}</div>
                  )}
                  <div className={styles.planHeader}>
                    <h3 className={styles.planName}>{plan.name}</h3>
                    <p className={styles.planPrice}>
                      {plan.price} zł
                      <span className={styles.priceHint}> (jednorazowo)</span>
                    </p>
                    <p className={styles.planCredits}>{plan.credits} opisów</p>
                  </div>
                  <ul className={styles.benefitsList}>
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className={styles.benefitItem}>
                        <span className={styles.check}>✅</span>
                        <span className={styles.benefit}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.id)}
                    className={styles.ctaButton}
                    aria-label={`Wybierz pakiet ${plan.name}`}
                  >
                    Wybierz {plan.name}
                  </button>
                </div>
              );
            })}
          </div>

          <p className={styles.note}>
            1 klik = 1 opis. Jednorazowa płatność. Brak subskrypcji.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
