import styles from "./CardProduct.module.css";
import { plans } from "../../data/plans";

type CardProductProps = {
  mode?: "public" | "dashboard";
};

const CardProduct = ({ mode = "public" }: CardProductProps) => {
  const isDashboard = mode === "dashboard";

  const handleBuy = async (planId: string) => {
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

  return (
    <>
      <div className={styles.grid}>
        {plans.map((plan) => {
          const featured = plan.id === "standard";
          const perCredit = (plan.price / plan.credits).toFixed(2);

          return (
            <div
              key={plan.id}
              className={`${styles.card} ${featured ? styles.featured : ""}`}
            >
              {featured && plan.badge && (
                <div className={styles.badge}>{plan.badge}</div>
              )}

              <div className={styles.cardTop}>
                <h3 className={styles.title}>{plan.name}</h3>
                <p className={styles.price}>
                  {plan.price}
                  <span className={styles.priceHint}> zł</span>
                </p>
                <p className={styles.credits}>
                  {plan.credits} opisów · {perCredit} zł / opis
                </p>
              </div>

              <ul className={styles.benefitsList}>
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className={styles.benefitItem}>
                    <span className={styles.check} aria-hidden>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M2.5 7.5L5.5 10.5L11.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <p className={styles.benefit}>{benefit}</p>
                  </li>
                ))}
              </ul>

              {isDashboard && (
                <button
                  type="button"
                  onClick={() => handleBuy(plan.id)}
                  className={featured ? styles.ctaFeatured : styles.cta}
                  aria-label={`Aktywuj pakiet ${plan.name}`}
                >
                  Aktywuj {plan.name}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className={styles.note}>
        1 klik = 1 opis. Jednorazowa płatność. Brak subskrypcji.
      </p>
    </>
  );
};

export default CardProduct;
