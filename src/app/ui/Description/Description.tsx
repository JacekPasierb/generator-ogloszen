import React, {useState} from "react";
import styles from "./Description.module.css";
import Title from "../../components/Title/Title";
import {useDescription} from "../../context/DescriptionContext";
import {toast} from "react-toastify";
import { saveDescription } from "../../services/descriptionServices";

const Description = () => {
  const {description, setDescription} = useDescription();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addDescription = async () => {
    try {
      await saveDescription(description);
      setSaved(true);
      setDescription("");
      toast("Opis zapisany!");
    } catch (err) {
      setCooldown(true);
      setTimeout(() => setCooldown(false), 4000);
  
      if (err instanceof Error) {
        switch (err.message) {
          case "Można zapisać maksymalnie 5 opisów":
            toast(
              "Osiągnięto limit zapisanych opisów. Usuń jeden z zapisanych opisów, aby dodać nowy."
            );
            break;
          default:
            toast.error("Nie udało się zapisać opisu. Spróbuj ponownie później.");
        }
      } else {
        toast.error("Wystąpił nieznany błąd.");
      }
    }
  };

  return (
    <section className={`section container`}>
      <Title>Wygenerowany opis:</Title>
      <div className={styles.boxDescription}>
        <textarea
          readOnly
          value={description}
          rows={5}
          className={styles.result}
        />
      </div>
      <div className={styles.boxBtn}>
        <button className={styles.actionButton} onClick={handleCopy}>
          {copied ? "Skopiowano!" : "📋 Kopiuj"}
        </button>
        <button
          className={styles.actionButton}
          onClick={addDescription}
          disabled={saved || cooldown}
        >
          {saved ? "Zapisano!" : "📂 Zapisz"}
        </button>
      </div>
    </section>
  );
};

export default Description;
