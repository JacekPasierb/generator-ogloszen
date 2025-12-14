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
  const [savedDescriptions, setSavedDescriptions] = useState<
    SavedDescription[]
  >([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();

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

  // ✅ senior flow: UI natychmiast, request w tle
  const handleLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    const loggedOut: MeResponse = {error: "Unauthorized"};
    mutate(loggedOut, {revalidate: false});

    router.replace("/login");
    void logoutUser();
  };

  const isLoadingUser = user === undefined;

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
          <span
            title="Zapisane opisy"
            aria-label="Zapisane opisy"
            onClick={handleOpenModal}
            className={styles.icons}
          >
            📓
          </span>

          <span
            className={styles.icons}
            onClick={handleLogout}
            aria-disabled={isLoggingOut}
            title={isLoggingOut ? "Wylogowywanie..." : "Wyloguj"}
          >
            {isLoggingOut ? "⏳" : "🙋‍♂️"}
          </span>
        </div>
      </nav>

      {/* Informacje o koncie – pokazuj dopiero gdy user jest znany */}
      {!isLoadingUser && (
        <>
          <div className={styles.accountRow}>
            <div className={styles.accountChip}>
              <span className={styles.accountDot} aria-hidden />
              <span className={styles.accountEmail}>
                Witaj {user?.email ?? "—"}
              </span>
            </div>

            <div
              className={`${styles.planChip} ${
                isPaid ? styles.planPaid : styles.planFree
              }`}
            >
              {isPaid
                ? aiLeft > 0
                  ? `Pakiet: ${plan.toUpperCase()} 💎`
                  : `Pakiet: Wykorzystany`
                : "Pakiet: nieaktywny"}
            </div>
          </div>

          <div className={styles.sectionDivider} aria-hidden />

          {isPaid && (
            <div className={styles.boxActions}>
              <div className={styles.boxUsage}>
                <p className={styles.text}>
                  Pozostałe zapytania:{" "}
                  <strong>
                    {aiLeft} / {aiLimit}
                  </strong>
                </p>
              </div>{" "}
            </div>
          )}
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
