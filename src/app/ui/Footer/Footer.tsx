import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { APP_VERSION } from "@/app/config/version";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <Link href="/" className={styles.brand}>
              <Image
                src="/logo.png"
                width={36}
                height={36}
                alt=""
                className={styles.brandMark}
              />
              <span className={styles.brandName}>Generator Ogłoszeń</span>
            </Link>
            <p className={styles.tagline}>
              Opisy sprzedażowe z kilku słów kluczowych — gotowe na OLX, Vinted
              i Marketplace.
            </p>
          </div>

          <nav className={styles.columns} aria-label="Stopka">
            <div className={styles.col}>
              <p className={styles.colTitle}>Produkt</p>
              <a href="/#pricing" className={styles.link}>
                Cennik
              </a>
              <a href="/#examples" className={styles.link}>
                Przykłady
              </a>
              <Link href="/register" className={styles.link}>
                Zacznij za darmo
              </Link>
              <Link href="/login" className={styles.link}>
                Zaloguj
              </Link>
            </div>

            <div className={styles.col}>
              <p className={styles.colTitle}>Informacje</p>
              <Link href="/polityka-prywatnosci" className={styles.link}>
                Polityka prywatności
              </Link>
              <Link href="/regulamin" className={styles.link}>
                Regulamin
              </Link>
              <Link href="/updates" className={styles.link}>
                Co nowego
              </Link>
            </div>

            <div className={styles.col}>
              <p className={styles.colTitle}>Social</p>
              <a
                href="https://www.facebook.com/generatorogloszenpl/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Facebook
              </a>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {currentYear} generator-ogloszen.com
          </p>
          <p className={styles.version}>v{APP_VERSION}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
