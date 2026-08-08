"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ModalDescription.module.css";
import { SavedDescription } from "../../ui/Header/Header";
import { deleteDescription } from "../../services/descriptionServices";
import { toast } from "react-toastify";

interface ModalProps {
  title: string;
  data: SavedDescription[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

function formatSavedDate(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const currentDescription = data[currentPage];
  const hasItems = data.length > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!hasItems) return;
      if (e.key === "ArrowLeft" && currentPage > 0) {
        setCurrentPage((p) => p - 1);
      }
      if (e.key === "ArrowRight" && currentPage < data.length - 1) {
        setCurrentPage((p) => p + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, hasItems, currentPage, data.length]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => {
    setCopied(false);
  }, [currentPage]);

  const onPrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const onNext = () => {
    if (currentPage < data.length - 1) setCurrentPage((prev) => prev + 1);
  };

  const formatSavedPackage = (item: SavedDescription) => {
    const parts = [
      item.title?.trim() ? `Tytuł:\n${item.title.trim()}` : null,
      item.short?.trim() ? `Krótko:\n${item.short.trim()}` : null,
      `Opis:\n${item.text.trim()}`,
    ].filter(Boolean);
    return parts.join("\n\n");
  };

  const handleCopy = async () => {
    if (!currentDescription?.text) return;
    try {
      await navigator.clipboard.writeText(formatSavedPackage(currentDescription));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Nie udało się skopiować.");
    }
  };

  const handleDelete = async () => {
    if (!currentDescription?._id) return;

    setLoading(true);
    try {
      await deleteDescription(currentDescription._id);
      toast.success("Opis został usunięty");
      onDelete(currentDescription._id);
      setCurrentPage((prev) => Math.max(0, Math.min(prev, data.length - 2)));
    } catch (err) {
      console.error("Błąd:", err);
      toast.error("Nie udało się usunąć opisu.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-modal-title"
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.eyebrow}>Biblioteka</p>
            <h2 id="saved-modal-title" className={styles.title}>
              {title}
            </h2>
            <p className={styles.meta}>
              {hasItems ? (
                <>
                  <span className={styles.countPill}>
                    {currentPage + 1} / {data.length}
                  </span>
                  {currentDescription?.date && (
                    <span className={styles.date}>
                      {formatSavedDate(currentDescription.date)}
                    </span>
                  )}
                </>
              ) : (
                "Brak zapisanych opisów"
              )}
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Zamknij"
          >
            <span aria-hidden className={styles.closeIcon} />
          </button>
        </header>

        {hasItems ? (
          <div className={styles.body}>
            {(currentDescription.title || currentDescription.short) && (
              <div className={styles.metaBlocks}>
                {currentDescription.title && (
                  <div className={styles.metaBlock}>
                    <span className={styles.metaLabel}>Tytuł</span>
                    <p className={styles.metaValue}>{currentDescription.title}</p>
                  </div>
                )}
                {currentDescription.short && (
                  <div className={styles.metaBlock}>
                    <span className={styles.metaLabel}>Krótko</span>
                    <p className={styles.metaValue}>{currentDescription.short}</p>
                  </div>
                )}
              </div>
            )}

            <div className={styles.preview}>
              <textarea
                readOnly
                value={currentDescription.text}
                className={styles.result}
                aria-label="Zapisany opis"
              />
            </div>

            <div className={styles.toolbar}>
              <div className={styles.nav}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={onPrev}
                  disabled={currentPage === 0}
                  aria-label="Poprzedni opis"
                >
                  Poprzedni
                </button>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={onNext}
                  disabled={currentPage === data.length - 1}
                  aria-label="Następny opis"
                >
                  Następny
                </button>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnCopy} ${
                    copied ? styles.btnCopied : ""
                  }`}
                  onClick={handleCopy}
                >
                  {copied ? "Skopiowano" : "Kopiuj"}
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Usuwanie…" : "Usuń"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyMark} aria-hidden />
            <p className={styles.emptyTitle}>Jeszcze nic tu nie ma</p>
            <p className={styles.emptyDesc}>
              Wygeneruj opis ze słów kluczowych i kliknij „Zapisz” — wrócisz do
              niego w każdej chwili.
            </p>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={onClose}
            >
              Wróć do generatora
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ModalDescriptions;
