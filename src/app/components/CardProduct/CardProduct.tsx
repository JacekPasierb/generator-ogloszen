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
          const hasBadge = Boolean(plan.badge);

          return (
            <div
              key={plan.id}
              className={[
                styles.card,
                hasBadge ? styles.featured : "",
                hasBadge ? styles.hasBadge : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {hasBadge && (
                <div
                  className={`${styles.badge} ${
                    plan.id === "start" ? styles.badgeStart : ""
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className={styles.title}>{plan.name}</h3>

                <p className={styles.price}>
                  {plan.price} zł
                  <span className={styles.priceHint}> (jednorazowo)</span>
                </p>

                <p className={styles.credits}>{plan.credits} opisów</p>
              </div>

              <ul className={styles.benefitsList}>
                {plan.benefits.map((benefit, index) => (
                  <li key={index} className={styles.benefitItem}>
                    <span className={styles.check}>✅</span>
                    <p className={styles.benefit}>{benefit}</p>
                  </li>
                ))}
              </ul>

              {/* CTA tylko w dashboard */}
              {isDashboard && (
                <button
                  onClick={() => handleBuy(plan.id)}
                  className={styles.cta}
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
