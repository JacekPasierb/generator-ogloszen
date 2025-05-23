import React, {useState} from "react";
import styles from "./ModalDescription.module.css";
import { SavedDescription } from "../../ui/Header/Header";

interface ModalProps {
  title: string;
  data: SavedDescription[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ModalDescriptions: React.FC<ModalProps> = ({
  title,
  data,
  onDelete,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleNext = () => {
    if (currentPage < data.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDescription.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    // try {
    //   await deleteDescription(currentDescription._id);
    //   toast("Opis został usunięty!");
    //   onDelete(currentDescription._id);
    //   setCurrentPage((prev) => Math.max(0, prev - 1));
    // } catch (err) {
    //   console.error("Błąd:", err);
    //   toast.error("Nie udało się usunąć opisu.");
    // }
  };

  const currentDescription = data[currentPage];
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Zamknij"
          >
            ✖
          </button>
        </div>
        {data.length > 0 ? (
          <div className={styles.content}>
            <textarea
              readOnly
              value={currentDescription.text}
              className={styles.result}
            />
            <div className={styles.actionsBtn}>
              <button className={styles.actionButton} onClick={handleCopy}>
                {copied ? "Skopiowano!" : "📋 Kopiuj do schowka"}
              </button>
              <button className={styles.actionButton} onClick={handleDelete}>
                🗑️ Usuń
              </button>
            </div>

            <div className={styles.pagination}>
              <button onClick={handlePrevious} disabled={currentPage === 0}>
                ⬅ Poprzedni
              </button>
              <span>
                {currentPage + 1} / {data.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === data.length - 1}
              >
                Następny ➡
              </button>
            </div>
          </div>
        ) : (
          <p>Brak zapisanych opisów</p>
        )}
      </div>
    </div>
  );
};

export default ModalDescriptions;
