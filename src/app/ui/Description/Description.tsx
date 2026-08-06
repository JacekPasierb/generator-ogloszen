import React, { useEffect, useRef, useState } from "react";
import styles from "./Description.module.css";
import Title from "../../components/Title/Title";
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

  const { mutate } = useUser();

  // ✅ jak pojawi się NOWY opis (po generowaniu), resetuj flagi
  useEffect(() => {
    setSaved(false);
    setCooldown(false);
    setCopied(false);

    if (description?.trim() && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [description]);

  const handleCopy = () => {
    if (!description?.trim()) return;
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addDescription = async () => {
    // ✅ jeśli nie ma opisu lub już trwa zapis, to nic nie rób
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
            toast.error("Nie udało się zapisać opisu. Spróbuj ponownie później.");
        }
      } else {
        toast.error("Wystąpił nieznany błąd.");
      }

      // ✅ przy błędzie pozwól kliknąć ponownie
      isSavingRef.current = false;
    } finally {
      setIsSaving(false);
      // ⚠️ przy sukcesie component znika (bo setDescription("")),
      // więc ref i tak „umiera”. Ale zostawiamy to bezpiecznie:
    }
  };

  const saveDisabled = saved || cooldown || isSaving;

  return (
    <section className={`section container`} ref={resultRef}>
      <Title>Wygenerowany opis:</Title>

      {title && (
        <div className={styles.boxMeta}>
          <span className={styles.metaLabel}>Tytuł:</span>
          <p className={styles.metaValue}>{title}</p>
        </div>
      )}
      {short && (
        <div className={styles.boxMeta}>
          <span className={styles.metaLabel}>Krótko (do 160 znaków):</span>
          <p className={styles.metaValue}>{short}</p>
        </div>
      )}

      <div className={styles.boxDescription}>
        <textarea readOnly value={description} rows={6} className={styles.result} />
      </div>

      <div className={styles.boxBtn}>
        <button
          className={styles.actionButton}
          onClick={handleCopy}
          aria-label="Skopiuj opis"
          title="Skopiuj opis"
          disabled={!description?.trim()}
        >
          {copied ? "Skopiowano!" : "📋 Kopiuj"}
        </button>

        <button
          className={styles.actionButton}
          onClick={addDescription}
          disabled={saveDisabled}
          aria-label="Zapisz opis"
          title="Zapisz opis"
        >
          {isSaving ? "Zapisywanie..." : saved ? "Zapisano!" : "📂 Zapisz"}
        </button>
      </div>
    </section>
  );
};

export default Description;
