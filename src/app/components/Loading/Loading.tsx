import React from "react";
import Image from "next/image";
import styles from "./Loading.module.css";

type LoadingProps = {
  label?: string;
  /** Węższy loader do Suspense / sekcji (bez pełnego ekranu) */
  compact?: boolean;
};

const Loading = ({
  label = "Ładowanie…",
  compact = false,
}: LoadingProps) => {
  return (
    <div
      className={`${styles.wrapper} ${compact ? styles.compact : ""}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {!compact && <div className={styles.atmosphere} aria-hidden />}

      <div className={styles.panel}>
        {!compact && (
          <div className={styles.brand}>
            <Image
              src="/logo.png"
              width={40}
              height={40}
              alt=""
              className={styles.brandMark}
              priority
            />
            <span className={styles.brandName}>Generator Ogłoszeń</span>
          </div>
        )}

        <div className={styles.spinnerWrap} aria-hidden>
          <span className={styles.ring} />
          <span className={styles.ringAccent} />
        </div>

        <p className={styles.text}>{label}</p>
        {!compact && (
          <p className={styles.hint}>Przygotowujemy Twój workspace</p>
        )}
      </div>
    </div>
  );
};

export default Loading;
