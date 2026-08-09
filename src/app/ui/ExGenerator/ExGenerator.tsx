"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./ExGenerator.module.css";
import { examples } from "../../data/exGenerators";

const ExGenerator = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="examples"
      className={styles.section}
      aria-labelledby="examples-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Przykłady</p>
          <h2 id="examples-heading" className={styles.headline}>
            Ze zdjęcia lub słów.
            <br />
            <span className={styles.headlineAccent}>Pełny opis sprzedaży.</span>
          </h2>
          <p className={styles.support}>
            Tak działa Generator Ogłoszeń: wrzucasz fotkę produktu albo kilka
            faktów — AI składa tekst gotowy do OLX, Vinted czy Marketplace.
          </p>
        </header>

        <div className={styles.list}>
          {examples.map((ex, index) => (
            <article key={ex.title} className={styles.item}>
              <div className={styles.itemMeta}>
                <span className={styles.category}>{ex.category}</span>
                <span className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className={styles.planes}>
                <div className={styles.planeIn}>
                  <p className={styles.planeLabel}>Wejście</p>
                  <p className={styles.keywords}>{ex.keywords}</p>
                </div>

                <div className={styles.arrow} aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 10h12M12 6l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className={styles.planeOut}>
                  <div className={styles.planeOutHead}>
                    <p className={styles.planeLabel}>Opis sprzedażowy</p>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={() => handleCopy(ex.desc, index)}
                      aria-label={`Kopiuj opis: ${ex.title}`}
                    >
                      {copiedIndex === index ? "Skopiowano" : "Kopiuj"}
                    </button>
                  </div>
                  <h3 className={styles.itemTitle}>{ex.title}</h3>
                  <p className={styles.desc}>{ex.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Twoje zdjęcie. Twoje słowa. Gotowy opis w kilka sekund.
          </p>
          <Link href="/register" className={styles.cta}>
            Wygeneruj ze zdjęcia
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExGenerator;
