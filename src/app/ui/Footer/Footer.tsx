import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <section className={`section container ${styles.footer}`}>
      <div>
        <p>&copy; {currentYear} generator-ogloszen.com</p>
        <div className={styles.links}>
          <Link href="/polityka-prywatnosci" className={styles.link}>
            Polityka prywatności
          </Link>
          <Link href="/regulamin" className={styles.link}>
            Regulamin
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Footer;
