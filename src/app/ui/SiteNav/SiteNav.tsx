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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
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

        <nav className={styles.desktopLinks} aria-label="Główne">
          <Link href="/#pricing" className={styles.navLink}>
            Cennik
          </Link>
          <Link href="/#examples" className={styles.navLink}>
            Przykłady
          </Link>
          <Link href="/login" className={styles.navLink}>
            Zaloguj
          </Link>
          <Link href="/register" className={styles.navCta}>
            Zacznij za darmo
          </Link>
        </nav>

        <button
          type="button"
          className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ""}`}
          aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
        </button>
      </div>

      <div
        className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ""}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />

      <nav
        id="site-mobile-menu"
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
        aria-label="Menu mobilne"
        aria-hidden={!menuOpen}
      >
        <div className={styles.drawerInner}>
          <div className={styles.drawerHead}>
            <p className={styles.drawerEyebrow}>Nawigacja</p>
            <p className={styles.drawerTitle}>Generator Ogłoszeń</p>
            <p className={styles.drawerLead}>
              Opisy marketingowe ze słów kluczowych — gotowe pod OLX i Marketplace.
            </p>
          </div>

          <div className={styles.drawerNav}>
            <Link
              href="/#pricing"
              className={styles.drawerLink}
              onClick={closeMenu}
            >
              <span className={styles.drawerLinkMain}>Cennik</span>
              <span className={styles.drawerLinkSub}>
                Jednorazowe pakiety, bez subskrypcji
              </span>
            </Link>
            <Link
              href="/#examples"
              className={styles.drawerLink}
              onClick={closeMenu}
            >
              <span className={styles.drawerLinkMain}>Przykłady</span>
              <span className={styles.drawerLinkSub}>
                Zobacz, jak wyglądają gotowe opisy
              </span>
            </Link>
            <Link
              href="/login"
              className={styles.drawerLink}
              onClick={closeMenu}
            >
              <span className={styles.drawerLinkMain}>Zaloguj</span>
              <span className={styles.drawerLinkSub}>
                Wróć do swojego workspace
              </span>
            </Link>
          </div>

          <div className={styles.drawerFoot}>
            <Link
              href="/register"
              className={styles.drawerCta}
              onClick={closeMenu}
            >
              Zacznij za darmo
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default SiteNav;
