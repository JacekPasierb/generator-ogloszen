import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";
import { APP_VERSION } from "@/app/config/version";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <section className={`section container ${styles.footer}`}>
      <div>
        <p className={styles.copy}>
          &copy; {currentYear} generator-ogloszen.com
        </p>

        <div className={styles.links}>
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

        <p className={styles.version}>v{APP_VERSION}</p>
      </div>
    </section>
  );
};

export default Footer;
