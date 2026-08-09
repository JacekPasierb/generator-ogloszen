import React from "react";
import Link from "next/link";
import styles from "./Pricing.module.css";
import { plans } from "../../data/plans";

const Pricing = () => {
  return (
    <section id="pricing" className={styles.section} aria-labelledby="pricing-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Cennik</p>
          <h2 id="pricing-heading" className={styles.headline}>
            Płać za opisy.
            <br />
            <span className={styles.headlineAccent}>Nie za subskrypcję.</span>
          </h2>
          <p className={styles.support}>
            Jednorazowe pakiety kredytów. 1 generacja = 1 kredyt — także ze
            zdjęcia. Bez abonamentu, bez niespodzianek.
          </p>
        </header>

        <div className={styles.grid}>
          {plans.map((plan) => {
            const featured = plan.id === "standard";
            const perCredit = (plan.price / plan.credits).toFixed(2);

            return (
              <article
                key={plan.id}
                className={`${styles.card} ${featured ? styles.cardFeatured : ""}`}
              >
                {featured && (
                  <span className={styles.badge}>{plan.badge}</span>
                )}

                <div className={styles.cardTop}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{plan.price}</span>
                    <span className={styles.currency}>zł</span>
                  </div>
                  <p className={styles.meta}>
                    {plan.credits} opisów · {perCredit} zł / opis
                  </p>
                </div>

                <ul className={styles.benefits}>
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className={styles.benefit}>
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
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={featured ? styles.ctaPrimary : styles.ctaGhost}
                >
                  Wybierz {plan.name}
                </Link>
              </article>
            );
          })}
        </div>

        <p className={styles.footnote}>
          2 darmowe generacje po rejestracji. Potem wybierasz pakiet.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
