import styles from "./HowItWorks.module.css";

const steps = [
  {
    n: "01",
    title: "Wrzuć zdjęcie lub słowa",
    text: "Dodaj fotkę produktu — AI rozpozna przedmiot. Możesz dopisać fakty, które warto podkreślić.",
  },
  {
    n: "02",
    title: "Dostajesz gotowy opis",
    text: "Tytuł, krótka wersja i pełny tekst sprzedażowy pod OLX, Vinted i Marketplace.",
  },
  {
    n: "03",
    title: "Kopiuj i publikuj",
    text: "Jeden klik — wklejasz do ogłoszenia. Zdjęcie nie jest przechowywane na serwerze.",
  },
] as const;

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
          {steps.map((step) => (
            <li key={step.n} className={styles.step}>
              <span className={styles.num} aria-hidden>
                {step.n}
              </span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
