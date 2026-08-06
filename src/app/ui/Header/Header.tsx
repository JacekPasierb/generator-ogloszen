"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./Header.module.css";
import { MeResponse, useUser } from "../../hooks/useUser";
import ModalDescriptions from "../../components/ModalDescription/ModalDescription";
import { fetchDescription } from "../../services/descriptionServices";
import { logoutUser } from "../../services/authService";
import { useRouter } from "next/navigation";

export interface SavedDescription {
  text: string;
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

  const router = useRouter();
  const isLoadingUser = user === undefined;

  const fetchSavedDescriptions = async () => {
    try {
      const descriptions = await fetchDescription();
      setSavedDescriptions(descriptions);
    } catch (err) {
      console.error("Błąd podczas pobierania zapisanych opisów:", err);
    }
  };

  const handleOpenModal = async () => {
    setMenuOpen(false);
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
    setMenuOpen(false);

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

  const emailShort = user?.email
    ? user.email.length > 22
      ? `${user.email.slice(0, 18)}…`
      : user.email
    : "—";

  return (
    <header className={styles.header}>
      <div className={styles.navInner}>
        <Link href="/dashboard" className={styles.brand}>
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

        <div
          className={`${styles.actions} ${menuOpen ? styles.actionsOpen : ""}`}
        >
          {!isLoadingUser && (
            <div
              className={`${styles.creditsPill} ${
                isPaid
                  ? styles.creditsPaid
                  : trialCredits > 0
                    ? styles.creditsTrial
                    : styles.creditsFree
              }`}
              title={
                isPaid
                  ? `Pozostało ${safeLeft} z ${safeLimit} opisów`
                  : trialCredits > 0
                    ? `${trialCredits} kredytów testowych`
                    : "Brak kredytów — wybierz pakiet"
              }
            >
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
          )}

          <button
            type="button"
            onClick={handleOpenModal}
            className={styles.navBtn}
          >
            Zapisane
          </button>

          <Link
            href="/dashboard/billing"
            className={styles.navBtn}
            onClick={() => setMenuOpen(false)}
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
          className={styles.menuToggle}
          aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.menuBar} data-open={menuOpen} />
          <span className={styles.menuBar} data-open={menuOpen} />
        </button>
      </div>

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
