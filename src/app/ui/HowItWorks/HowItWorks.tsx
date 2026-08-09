import { Fragment } from "react";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    n: "01",
    title: "Wrzuć zdjęcie lub dodaj słowa",
    text: "Dodaj zdjęcie produktu — AI rozpozna, co na nim jest. Możesz dopisać najważniejsze informacje, np. stan, rozmiar lub cenę.",
  },
  {
    n: "02",
    title: "Dostajesz gotowy opis",
    text: "AI przygotuje tytuł, krótki opis i pełny tekst sprzedażowy dopasowany do OLX, Vinted lub Marketplace.",
  },
  {
    n: "03",
    title: "Kopiuj i publikuj",
    text: "Jednym kliknięciem kopiujesz gotową treść i wklejasz ją do swojego ogłoszenia.",
  },
] as const;

const StepArrow = () => (
  <li className={styles.arrow} aria-hidden="true">
    <svg
      className={styles.arrowIcon}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 12h12M13 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </li>
);

const HowItWorks = () => {
  return (
    <section
      id="how"
      className={styles.section}
      aria-labelledby="how-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Jak to działa</p>
          <h2 id="how-heading" className={styles.headline}>
            Od zdjęcia
            <br />
            <span className={styles.headlineAccent}>do ogłoszenia.</span>
          </h2>
          <p className={styles.support}>
            Nie musisz opisywać produktu od zera — wystarczy fotka, którą i tak
            masz na telefonie.
          </p>
        </header>

        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <Fragment key={step.n}>
              <li className={styles.step}>
                <span className={styles.num} aria-hidden>
                  {step.n}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </li>
              {index < steps.length - 1 ? <StepArrow /> : null}
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
