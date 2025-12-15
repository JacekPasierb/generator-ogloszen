import React, {useEffect, useState} from "react";
import styles from "./ModalDescription.module.css";
import {SavedDescription} from "../../ui/Header/Header";
import {deleteDescription} from "../../services/descriptionServices";
import {toast} from "react-toastify";
import Pagination from "../Pagination/Pagination";

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
  const [loading, setLoading] = useState(false);

  const currentDescription = data[currentPage];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onPrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const onNext = () => {
    if (currentPage < data.length - 1) setCurrentPage((prev) => prev + 1);
  };

  const handleCopy = () => {
    if (!currentDescription?.text) return;
    navigator.clipboard.writeText(currentDescription.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!currentDescription?._id) return;

    setLoading(true);
    try {
      await deleteDescription(currentDescription._id);
      toast("Opis został usunięty!");
      onDelete(currentDescription._id);

      // cofamy stronę gdy usunięto ostatni element
      setCurrentPage((prev) => Math.max(0, Math.min(prev, data.length - 2)));
    } catch (err) {
      console.error("Błąd:", err);
      toast.error("Nie udało się usunąć opisu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.meta}>
              {data.length > 0 ? (
                <>
                  <span className={styles.metaDot} aria-hidden />{" "}
                  {currentPage + 1} / {data.length}
                </>
              ) : (
                "Brak zapisanych opisów"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Zamknij"
            title="Zamknij"
          >
            ✕
          </button>
        </div>

        {data.length > 0 ? (
          <div className={styles.content}>
            <div className={styles.textCard}>
              <textarea
                readOnly
                value={currentDescription.text}
                className={styles.result}
              />
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnGhost}`}
                onClick={handleCopy}
                aria-label="Kopiuj opis"
                title="Kopiuj opis"
              >
                {copied ? "✅ Skopiowano" : "📋 Kopiuj"}
              </button>

              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={handleDelete}
                disabled={loading}
                aria-label="Usuń opis"
                title="Usuń opis"
              >
                {loading ? "Usuwanie..." : "🗑️ Usuń"}
              </button>
            </div>

            <div className={styles.paginationWrap}>
              <Pagination
                handleNext={onNext}
                handlePrevious={onPrev}
                currentPage={currentPage}
                total={data.length}
              />
            </div>
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📓</div>
            <p className={styles.emptyTitle}>Brak zapisanych opisów</p>
            <p className={styles.emptyDesc}>
              Wygeneruj opis i kliknij „Zapisz”, a potem wróć tutaj.
            </p>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={onClose}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDescriptions;
