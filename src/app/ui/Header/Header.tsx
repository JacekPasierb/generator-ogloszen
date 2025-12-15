import Image from "next/image";
import React, {useState} from "react";
import styles from "./Header.module.css";
import {MeResponse, useUser} from "../../hooks/useUser";
import ModalDescriptions from "../../components/ModalDescription/ModalDescription";
import {fetchDescription} from "../../services/descriptionServices";
import {logoutUser} from "../../services/authService";
import {useRouter} from "next/navigation";

export interface SavedDescription {
  text: string;
  date: string;
  _id: string;
}

const Header = () => {
  const {user, plan, isPaid, aiLimit, aiLeft, mutate} = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedDescriptions, setSavedDescriptions] = useState<SavedDescription[]>(
    []
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

    const loggedOut: MeResponse = {error: "Unauthorized"};
    mutate(loggedOut, {revalidate: false});

    router.replace("/login");
    void logoutUser();
  };

  const safeLimit = Math.max(aiLimit ?? 0, 0);
  const safeLeft = Math.max(aiLeft ?? 0, 0);

  const progressPct =
    safeLimit > 0 ? Math.max(0, Math.min(100, (safeLeft / safeLimit) * 100)) : 0;

  const planLabel = isPaid
    ? safeLeft > 0
      ? plan.toUpperCase()
      : `${plan.toUpperCase()} (wyczerpany)`
    : "NIEAKTYWNY";

  return (
    <header className={`container section ${styles.header}`}>
      <nav className={styles.nav}>
        <div className={styles.logoWrap}>
          <Image
            src="/logo.png"
            width={300}
            height={300}
            alt="logo GO"
            className={styles.logoHeader}
            priority
          />
        </div>

        <div className={styles.boxIcons}>
  <button
    type="button"
    onClick={handleOpenModal}
    className={styles.actionBtn}
    aria-label="Zapisane opisy"
    title="Zapisane opisy"
  >
    <span className={styles.actionIcon} aria-hidden>
      📓
    </span>
    <span className={styles.actionText}>Zapisane</span>
  </button>

  <button
    type="button"
    onClick={handleLogout}
    className={styles.actionBtn}
    disabled={isLoggingOut}
    aria-label="Wyloguj"
    title={isLoggingOut ? "Wylogowywanie..." : "Wyloguj"}
    aria-busy={isLoggingOut}
  >
    <span className={styles.actionIcon} aria-hidden>
      {isLoggingOut ? "⏳" : "🙋‍♂️"}
    </span>
    <span className={styles.actionText}>Wyloguj</span>
  </button>
</div>

      </nav>

      {!isLoadingUser && (
        <>
          <div className={styles.accountRow}>
            <div className={styles.accountChip}>
              <span className={styles.accountDot} aria-hidden />
              <span className={styles.accountEmail}>
                Witaj {user?.email ?? "—"}
              </span>
            </div>

            {/* ✅ Jeden spójny blok statusu */}
            <div
              className={`${styles.statusCard} ${
                isPaid ? styles.statusPaid : styles.statusFree
              }`}
            >
              <div className={styles.statusTop}>
                <span className={styles.statusTitle}>Pakiet</span>

                <span className={styles.statusBadge}>
                  {isPaid ? "💎" : "🔒"} {planLabel}
                </span>
              </div>

              {isPaid ? (
                <>
                  <div className={styles.statusMid}>
                    <span className={styles.statusSub}>Pozostałe zapytania</span>
                    <span className={styles.statusValue}>
                      {safeLeft}/{safeLimit}
                    </span>
                  </div>

                  <div className={styles.statusBar} aria-hidden>
                    <div
                      className={`${styles.statusProgress} ${
                        safeLeft === 0 ? styles.statusEmpty : ""
                      }`}
                      style={{width: `${progressPct}%`}}
                    />
                  </div>
                </>
              ) : (
                <div className={styles.statusHint}>
                  Odblokuj pakiet, aby generować opisy AI.
                </div>
              )}
            </div>
          </div>

          <div className={styles.sectionDivider} aria-hidden />
        </>
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
