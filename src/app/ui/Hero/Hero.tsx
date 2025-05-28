import React from "react";
import styles from "./Hero.module.css";
import Image from "next/image";
import Link from "next/link";
import RegisterLink from "../../components/RegisterLink/RegisterLink";

const Hero = () => {
  return (
    <section className={`container section ${styles.hero}`}>
      <article>
        <Image
          src="/logo.png"
          width={300}
          height={300}
          alt="Logo Generatora Ogłoszeń"
          className={styles.logoHero}
        />

        <h1 className={styles.titleHero}>Zamiast pisać – wygeneruj! </h1>
        <h2 className={styles.subtitleHero}>Opis ogłoszenia gotowy od ręki.</h2>
        <p className={styles.description}>
          Zobacz, jak wyglądają przykładowe opisy generowane przez AI i zacznij
          tworzyć własne.
        </p>
      </article>
      <Link href="/login" aria-label="Zaloguj się" className={styles.ctaBox}>
        Logowanie
      </Link>
      <RegisterLink />
    </section>
  );
};

export default Hero;
