"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Description.module.css";
import { useDescription } from "../../context/DescriptionContext";
import { toast } from "react-toastify";
import { saveDescription } from "../../services/descriptionServices";
import { useUser } from "../../hooks/useUser";
import {
  rewriteDescription,
  type RewriteMode,
} from "../../services/aiService";

const REWRITE_ACTIONS: { mode: RewriteMode; label: string }[] = [
  { mode: "shorter", label: "Skróć" },
  { mode: "stronger_cta", label: "Mocniejsze CTA" },
  { mode: "formal", label: "Bardziej formalnie" },
  { mode: "no_emoji", label: "Bez emoji" },
];

const Description = () => {
  const {
    description,
    title,
    short,
    keywords,
    features,
    checklist,
    variants,
    setDescription,
    patchText,
    applyVariant,
  } = useDescription();

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [rewriteBusy, setRewriteBusy] = useState<RewriteMode | null>(null);
  const [activeVariant, setActiveVariant] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const isSavingRef = useRef(false);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const prevVariantsRef = useRef(variants);

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
    if (prevVariantsRef.current !== variants) {
      prevVariantsRef.current = variants;
      setActiveVariant(0);
      setCheckedItems({});
    }
  }, [variants]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 120)}px`;
  }, [description]);

  const handleCopy = () => {
    if (!description?.trim()) return;
    const parts = [
      title?.trim() ? `Tytuł:\n${title.trim()}` : null,
      short?.trim() ? `Krótko:\n${short.trim()}` : null,
      features.length ? `Cechy:\n${features.map((f) => `• ${f}`).join("\n")}` : null,
      keywords.length ? `Frazy:\n${keywords.join(", ")}` : null,
      `Opis:\n${description.trim()}`,
    ].filter(Boolean);
    navigator.clipboard.writeText(parts.join("\n\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRewrite = async (mode: RewriteMode) => {
    if (!description?.trim() || rewriteBusy) return;
    setRewriteBusy(mode);
    try {
      const data = await rewriteDescription({
        text: description,
        mode,
        title,
      });
      patchText({
        description: data.description,
        title: data.title ?? title,
      });
      toast.success("Opis poprawiony");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Nie udało się poprawić opisu";
      toast.error(message);
    } finally {
      setRewriteBusy(null);
    }
  };

  const addDescription = async () => {
    if (!description?.trim()) return;
    if (isSavingRef.current) return;

    isSavingRef.current = true;
    setIsSaving(true);

    try {
      await saveDescription({
        description,
        title: title || undefined,
        short: short || undefined,
      });

      setSaved(true);
      setDescription("");
      mutate();
      toast.success("Opis zapisany!");
    } catch (err) {
      setCooldown(true);
      setTimeout(() => setCooldown(false), 4000);

      if (err instanceof Error) {
        if (err.message.includes("maksymalnie 2 opisy")) {
          toast.info(err.message);
        } else if (err.message === "Można zapisać maksymalnie 5 opisów") {
          toast.info(
            "Osiągnięto limit 5 opisów. Usuń jeden z zapisanych opisów, aby dodać nowy."
          );
        } else if (err.message.includes("403") || err.message.includes("dostępu")) {
          toast.error(err.message);
        } else {
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
  const hasContent = Boolean(description?.trim());

  if (!hasContent) return null;

  return (
    <section className={`container ${styles.section}`} ref={resultRef}>
      <div className={styles.panel}>
        <div className={styles.panelTop}>
          <span className={styles.eyebrow}>Wynik</span>
          <h2 className={styles.title}>Wygenerowane ogłoszenie</h2>
        </div>

        {variants.length > 1 && (
          <div className={styles.variantRow} role="tablist" aria-label="Warianty">
            {variants.map((v, i) => (
              <button
                key={`${v.label}-${i}`}
                type="button"
                role="tab"
                aria-selected={activeVariant === i}
                className={`${styles.variantChip} ${
                  activeVariant === i ? styles.variantChipActive : ""
                }`}
                onClick={() => {
                  setActiveVariant(i);
                  applyVariant(i);
                }}
              >
                {v.label || `Wariant ${i + 1}`}
              </button>
            ))}
          </div>
        )}

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

        {features.length > 0 && (
          <div className={styles.boxMeta}>
            <span className={styles.metaLabel}>Cechy produktu</span>
            <ul className={styles.bulletList}>
              {features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {keywords.length > 0 && (
          <div className={styles.boxMeta}>
            <span className={styles.metaLabel}>Frazy SEO / wyszukiwanie</span>
            <div className={styles.tagRow}>
              {keywords.map((k) => (
                <span key={k} className={styles.tag}>
                  {k}
                </span>
              ))}
            </div>
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

        <div className={styles.rewriteRow}>
          <span className={styles.metaLabel}>Popraw opis</span>
          <div className={styles.rewriteActions}>
            {REWRITE_ACTIONS.map(({ mode, label }) => (
              <button
                key={mode}
                type="button"
                className={styles.rewriteBtn}
                disabled={Boolean(rewriteBusy)}
                onClick={() => handleRewrite(mode)}
              >
                {rewriteBusy === mode ? "…" : label}
              </button>
            ))}
          </div>
        </div>

        {checklist.length > 0 && (
          <div className={styles.boxMeta}>
            <span className={styles.metaLabel}>Checklista przed publikacją</span>
            <ul className={styles.checkList}>
              {checklist.map((item, i) => (
                <li key={`${item}-${i}`}>
                  <label className={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={Boolean(checkedItems[i])}
                      onChange={() =>
                        setCheckedItems((prev) => ({
                          ...prev,
                          [i]: !prev[i],
                        }))
                      }
                    />
                    <span>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.boxBtn}>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.btnPrimary}`}
            onClick={handleCopy}
            aria-label="Skopiuj opis"
            disabled={!hasContent}
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
