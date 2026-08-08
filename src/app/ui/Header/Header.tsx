"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Header.module.css";
import { MeResponse, useUser } from "../../hooks/useUser";
import ModalDescriptions from "../../components/ModalDescription/ModalDescription";
import { fetchDescription } from "../../services/descriptionServices";
import { logoutUser } from "../../services/authService";
import { usePathname, useRouter } from "next/navigation";

export interface SavedDescription {
  text: string;
  title?: string;
  short?: string;
  date: string;
  _id: string;
}

const Header = () => {
  const {
    user,
    plan,
    isPaid,
    aiLimit,
    aiLeft,
    trialCredits,
    totalCredits,
    mutate,
  } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedDescriptions, setSavedDescriptions] = useState<
    SavedDescription[]
  >([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isLoadingUser = user === undefined;
  const isGenerator = pathname === "/dashboard";
  const isBilling = pathname?.startsWith("/dashboard/billing");

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  const fetchSavedDescriptions = async () => {
    try {
      const descriptions = await fetchDescription();
      setSavedDescriptions(descriptions);
    } catch (err) {
      console.error("Błąd podczas pobierania zapisanych opisów:", err);
    }
  };

  const handleOpenModal = async () => {
    closeMenu();
    await fetchSavedDescriptions();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDeleteDescription = (id: string) => {
    setSavedDescriptions((prev) => prev.filter((desc) => desc._id !== id));
  };

  const handleLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    closeMenu();

    const loggedOut: MeResponse = { error: "Unauthorized" };
    mutate(loggedOut, { revalidate: false });

    router.replace("/login");
    void logoutUser();
  };

  const safeLimit = Math.max(aiLimit ?? 0, 0);
  const safeLeft = Math.max(aiLeft ?? 0, 0);
  const progressPct =
    safeLimit > 0 ? Math.max(0, Math.min(100, (safeLeft / safeLimit) * 100)) : 0;

  const planName =
    plan === "free"
      ? trialCredits > 0
        ? "Trial"
        : "Free"
      : plan.charAt(0).toUpperCase() + plan.slice(1);

  const creditsLabel = isPaid
    ? `${safeLeft}/${safeLimit}`
    : `${totalCredits} kredyt${totalCredits === 1 ? "" : "ów"}`;

  const creditsTone = isPaid
    ? styles.creditsPaid
    : trialCredits > 0
      ? styles.creditsTrial
      : styles.creditsFree;

  const creditsTitle = isPaid
    ? `Pozostało ${safeLeft} z ${safeLimit} opisów`
    : trialCredits > 0
      ? `${trialCredits} kredytów testowych`
      : "Brak kredytów — wybierz pakiet";

  const emailShort = user?.email
    ? user.email.length > 22
      ? `${user.email.slice(0, 18)}…`
      : user.email
    : "—";

  const creditsBlock = !isLoadingUser ? (
    <div className={`${styles.creditsPill} ${creditsTone}`} title={creditsTitle}>
      <span className={styles.creditsPlan}>{planName}</span>
      <span className={styles.creditsSep} aria-hidden />
      <span className={styles.creditsValue}>{creditsLabel}</span>
      {isPaid && (
        <span className={styles.miniBar} aria-hidden>
          <span
            className={`${styles.miniProgress} ${
              safeLeft === 0 ? styles.miniEmpty : ""
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </span>
      )}
    </div>
  ) : null;

  return (
    <header className={`${styles.header} ${menuOpen ? styles.headerOpen : ""}`}>
      <div className={styles.navInner}>
        <Link href="/dashboard" className={styles.brand} onClick={closeMenu}>
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

        {/* Desktop */}
        <div className={styles.desktopNav}>
          {creditsBlock}

          <Link
            href="/dashboard"
            className={`${styles.navBtn} ${isGenerator ? styles.navBtnActive : ""}`}
            aria-current={isGenerator ? "page" : undefined}
          >
            Generator
          </Link>

          <button
            type="button"
            onClick={handleOpenModal}
            className={styles.navBtn}
          >
            Zapisane
          </button>

          <Link
            href="/dashboard/billing"
            className={`${styles.navBtn} ${isBilling ? styles.navBtnActive : ""}`}
            aria-current={isBilling ? "page" : undefined}
          >
            Konto
          </Link>

          {!isLoadingUser && (
            <span className={styles.emailChip} title={user?.email ?? undefined}>
              <span className={styles.emailDot} aria-hidden />
              {emailShort}
            </span>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutBtn}
            disabled={isLoggingOut}
            aria-busy={isLoggingOut}
          >
            {isLoggingOut ? "Wylogowywanie…" : "Wyloguj"}
          </button>
        </div>

        <button
          type="button"
          className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ""}`}
          aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={menuOpen}
          aria-controls="dashboard-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
        </button>
      </div>

      {mounted &&
        createPortal(
          <>
            <div
              className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ""}`}
              onClick={closeMenu}
              aria-hidden={!menuOpen}
            />

            <nav
              id="dashboard-mobile-menu"
              className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
              aria-label="Menu dashboardu"
              aria-hidden={!menuOpen}
            >
              <div className={styles.drawerInner}>
                <div className={styles.drawerHead}>
                  <p className={styles.drawerEyebrow}>Menu</p>
                  <p className={styles.drawerTitle}>Twój workspace</p>
                </div>

                {!isLoadingUser && (
                  <div className={styles.accountCard}>
                    <div className={styles.accountRow}>
                      <span className={styles.emailDot} aria-hidden />
                      <span className={styles.accountEmail} title={user?.email}>
                        {user?.email ?? "—"}
                      </span>
                    </div>
                    <div className={`${styles.drawerCredits} ${creditsTone}`}>
                      <span className={styles.creditsPlan}>{planName}</span>
                      <span className={styles.creditsValue}>{creditsLabel}</span>
                      {isPaid && (
                        <span className={styles.drawerBar} aria-hidden>
                          <span
                            className={`${styles.miniProgress} ${
                              safeLeft === 0 ? styles.miniEmpty : ""
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className={styles.drawerNav}>
                  <p className={styles.drawerSection}>Nawigacja</p>

                  <Link
                    href="/dashboard"
                    className={`${styles.drawerLink} ${
                      isGenerator ? styles.drawerLinkActive : ""
                    }`}
                    onClick={closeMenu}
                    aria-current={isGenerator ? "page" : undefined}
                  >
                    <span className={styles.drawerLinkMain}>Generator</span>
                    <span className={styles.drawerLinkSub}>
                      Słowa kluczowe → opis ogłoszenia
                    </span>
                  </Link>

                  <button
                    type="button"
                    className={styles.drawerLink}
                    onClick={handleOpenModal}
                  >
                    <span className={styles.drawerLinkMain}>Zapisane</span>
                    <span className={styles.drawerLinkSub}>
                      Biblioteka Twoich opisów
                    </span>
                  </button>

                  <Link
                    href="/dashboard/billing"
                    className={`${styles.drawerLink} ${
                      isBilling ? styles.drawerLinkActive : ""
                    }`}
                    onClick={closeMenu}
                    aria-current={isBilling ? "page" : undefined}
                  >
                    <span className={styles.drawerLinkMain}>Konto</span>
                    <span className={styles.drawerLinkSub}>
                      Plan, kredyty i aktywność
                    </span>
                  </Link>
                </div>

                <div className={styles.drawerFoot}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={styles.drawerLogout}
                    disabled={isLoggingOut}
                    aria-busy={isLoggingOut}
                  >
                    {isLoggingOut ? "Wylogowywanie…" : "Wyloguj"}
                  </button>
                </div>
              </div>
            </nav>
          </>,
          document.body
        )}

      {isModalOpen && (
        <ModalDescriptions
          onClose={handleCloseModal}
          title="Zapisane opisy"
          data={savedDescriptions}
          onDelete={handleDeleteDescription}
        />
      )}
    </header>
  );
};

export default Header;
