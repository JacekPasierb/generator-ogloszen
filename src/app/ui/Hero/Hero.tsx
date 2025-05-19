import React from "react";
import styles from "./Hero.module.css";
import Image from "next/image";
import Link from "next/link";
import RegisterLink from "../../components/RegisterLink/RegisterLink";

const Hero = () => {
  return (
    <section className={`container ${styles.section}`}>
      <Image
        src="/logo.png"
        width={300}
        height={300}
        alt="logo GO"
        className={styles.logoHero}
      />
      <div>
        <h1>Zamiast pisać – wygeneruj! </h1>
        <h2>Opis ogłoszenia gotowy od ręki.</h2>
        <p>
          Zobacz, jak wyglądają przykładowe opisy generowane przez AI i zacznij
          tworzyć własne.
        </p>
      </div>
      <Link href="/login" className={styles.ctaBox}>
        Logowanie
      </Link>
     <RegisterLink/>
    </section>
  );
};

export default Hero;
