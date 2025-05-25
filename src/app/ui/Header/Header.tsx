import Image from "next/image";
import React, {useEffect, useState} from "react";
import styles from "./Header.module.css";
import {useUser} from "../../hooks/useUser";
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
  const {isPro, aiUsed, aiLimit} = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedDescriptions, setSavedDescriptions] = useState<
    SavedDescription[]
  >([]);

  const [loading, setLoading] = useState(false);


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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteDescription = (id: string) => {
    setSavedDescriptions((prev) => prev.filter((desc) => desc._id !== id));
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      router.push("/login");
    } catch (err) {
      console.error("Błąd wylogowania", err);
    }
  };

  const handleBuyClick=async()=>{
    setLoading(true);
    try {
      const res = await fetch("/api/checkout-sessions", { method: "POST" });
      
      console.log("1", res);
      const data = await res.json();
      console.log("2",data);
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Błąd płatności", err);
      alert("Wystąpił błąd");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchSavedDescriptions();
  }, []);

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
          <span onClick={handleOpenModal} className={styles.icons}>
            📓
          </span>
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
            <button onClick={handleBuyClick} className={styles.linkAsBtn}>
              🔓 Odblokuj Pakiet AI (5 zł)
            </button>
            
          </div>
        )}
      </div>
      {isModalOpen && (
        <ModalDescriptions
          onClose={handleCloseModal}
          title="Zapisane opisy"
          data={savedDescriptions}
          onDelete={handleDeleteDescription}
        />
      )}
    </section>
  );
};

export default Header;
