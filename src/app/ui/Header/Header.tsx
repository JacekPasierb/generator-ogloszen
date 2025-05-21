import Image from "next/image";
import React from "react";
import styles from "./Header.module.css";
import {useUser} from "../../hooks/useUser";
import Link from "next/link";

const Header = () => {
  const {isPro, aiUsed, aiLimit} = useUser();

  return (
    <section className={`container section ${styles.header}`}>
      <nav className={styles.nav}>
        <Image
          src="/logo.png"
          width={300}
          height={300}
          alt="logo GO"
          className={styles.logoHeader}
        />
        <div className={styles.boxIcons}>
          <span style={{fontSize: "45px"}}>📓</span>
          <span style={{fontSize: "45px"}}>🙋‍♂️</span>
        </div>
      </nav>
      <div className={styles.boxActions}>
        <p className={styles.levelAccount}>
          <strong> Status Konta:</strong> {isPro ? "Pakiet AI 💎" : "Darmowe"}
        </p>
        {!isPro ? (
          <div className={styles.boxUsage}>
            <p className={styles.text}>
              Pozostałe zapytania:{" "}
              <strong>
                {aiLimit - aiUsed} / {aiLimit}
              </strong>
            </p>
          </div>
        ) : (
          <div className={styles.boxBtn}>
            <Link href="/pricing" className={styles.linkAsBtn}>
              🔓 Odblokuj Pakiet AI (5 zł)
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Header;
