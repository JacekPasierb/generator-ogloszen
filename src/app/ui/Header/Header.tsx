import Image from "next/image";
import React from "react";
import styles from "./Header.module.css";
import {useUser} from "../../hooks/useUser";
import Link from "next/link";

const Header = () => {
  const {isPro, aiUsed, aiLimit} = useUser();

  const handleLogout = async () => {
    await fetch("/api/logout", {method: "POST"});
    location.reload();
  };

  return (
    <section className={`container section ${styles.header}`}>
      <nav className={styles.nav}>
        <div style={{display: "flex", alignItems: "center"}}>
          <Image
            src="/logo.png"
            width={300}
            height={300}
            alt="logo GO"
            className={styles.logoHeader}
          />
        </div>
        <div className={styles.boxIcons}>
          <span className={styles.icons}>📓</span>
          <span className={styles.icons} onClick={handleLogout}>
            🙋‍♂️
          </span>
        </div>
      </nav>
      <div className={styles.boxActions}>
        <p className={styles.levelAccount}>
          <strong> Status Konta:</strong> {isPro ? "Pakiet AI 💎" : "Darmowe"}
        </p>
        {isPro ? (
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
