import React from "react";
import styles from "./Hero.module.css";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className={`container section ${styles.hero}`}>
      <article className={styles.content}>
        <Image
          src="/logo.png"
          width={300}
          height={300}
          alt="Logo Generatora Ogłoszeń"
          className={styles.logoHero}
        />

        <h1 className={styles.titleHero}>Zamiast pisać – wygeneruj! </h1>
        <h2 className={styles.subtitleHero}>
          Gotowy opis ogłoszenia w 10 sekund.
        </h2>
        <p className={styles.description}>
          Masz sklep lub dodajesz ogłoszenia? Wpisz kilka słów o produkcie, a
          otrzymasz profesjonalny opis, który przyciąga kupujących.
        </p>
        <p>➡ Pokażemy Ci przykładowe opisy, a potem stworzysz własne.</p>
      </article>

      {/* CTA */}
      <div className={styles.ctaGroup}>
        <Link href="/register" className={styles.ctaPrimary}>
        Zarejestruj się
        </Link>

        <Link href="/login" className={styles.ctaSecondary}>
          Mam już konto
        </Link>
      <p className={styles.trustText}>Zobacz przykłady za darmo. Aktywuj pakiet, aby generować własne opisy.</p>
      </div>

    </section>
  );
};

export default Hero;
