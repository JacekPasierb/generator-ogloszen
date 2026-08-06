"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./SiteNav.module.css";

const SiteNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.brand} onClick={closeMenu}>
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt=""
            className={styles.brandMark}
            priority
          />
          <span className={styles.brandName}>Generator Ogłoszeń</span>
        </Link>

        <nav
          className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}
          aria-label="Główne"
        >
          <Link href="/#pricing" className={styles.navLink} onClick={closeMenu}>
            Cennik
          </Link>
          <Link href="/#examples" className={styles.navLink} onClick={closeMenu}>
            Przykłady
          </Link>
          <Link href="/login" className={styles.navLink} onClick={closeMenu}>
            Zaloguj
          </Link>
          <Link href="/register" className={styles.navCta} onClick={closeMenu}>
            Zacznij za darmo
          </Link>
        </nav>

        <button
          type="button"
          className={styles.menuToggle}
          aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.menuBar} data-open={menuOpen} />
          <span className={styles.menuBar} data-open={menuOpen} />
        </button>
      </div>
    </header>
  );
};

export default SiteNav;
