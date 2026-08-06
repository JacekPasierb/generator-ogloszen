"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Description.module.css";
import { useDescription } from "../../context/DescriptionContext";
import { toast } from "react-toastify";
import { saveDescription } from "../../services/descriptionServices";
import { useUser } from "../../hooks/useUser";

const Description = () => {
  const { description, title, short, setDescription } = useDescription();

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isSavingRef = useRef(false);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutate } = useUser();

  useEffect(() => {
    setSaved(false);
    setCooldown(false);
    setCopied(false);

    if (description?.trim() && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [description]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 120)}px`;
  }, [description]);

  const handleCopy = () => {
    if (!description?.trim()) return;
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addDescription = async () => {
    if (!description?.trim()) return;
    if (isSavingRef.current) return;

    isSavingRef.current = true;
    setIsSaving(true);

    try {
      await saveDescription(description);

      setSaved(true);
      setDescription("");
      mutate();
      toast.success("Opis zapisany!");
    } catch (err) {
      setCooldown(true);
      setTimeout(() => setCooldown(false), 4000);

      if (err instanceof Error) {
        switch (err.message) {
          case "Można zapisać maksymalnie 5 opisów":
            toast.info(
              "Osiągnięto limit 5 opisów. Usuń jeden z zapisanych opisów, aby dodać nowy."
            );
            break;
          default:
            toast.error(
              "Nie udało się zapisać opisu. Spróbuj ponownie później."
            );
        }
      } else {
        toast.error("Wystąpił nieznany błąd.");
      }

      isSavingRef.current = false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveDisabled = saved || cooldown || isSaving;

  return (
    <section className={`container ${styles.section}`} ref={resultRef}>
      <div className={styles.panel}>
        <div className={styles.panelTop}>
          <span className={styles.eyebrow}>Wynik</span>
          <h2 className={styles.title}>Wygenerowany opis</h2>
        </div>

        {title && (
          <div className={styles.boxMeta}>
            <span className={styles.metaLabel}>Tytuł</span>
            <p className={styles.metaValue}>{title}</p>
          </div>
        )}
        {short && (
          <div className={styles.boxMeta}>
            <span className={styles.metaLabel}>Krótko (do 160 znaków)</span>
            <p className={styles.metaValue}>{short}</p>
          </div>
        )}

        <div className={styles.boxDescription}>
          <textarea
            ref={textareaRef}
            readOnly
            value={description}
            rows={3}
            className={styles.result}
            aria-label="Wygenerowany opis"
          />
        </div>

        <div className={styles.boxBtn}>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.btnPrimary}`}
            onClick={handleCopy}
            aria-label="Skopiuj opis"
            disabled={!description?.trim()}
          >
            {copied ? "Skopiowano" : "Kopiuj"}
          </button>

          <button
            type="button"
            className={styles.actionButton}
            onClick={addDescription}
            disabled={saveDisabled}
            aria-label="Zapisz opis"
          >
            {isSaving ? "Zapisywanie…" : saved ? "Zapisano" : "Zapisz"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Description;
