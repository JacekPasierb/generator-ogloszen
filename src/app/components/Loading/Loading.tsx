// components/Loading/Loading.tsx
import React from "react";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true"></div>
      <p className={styles.text}>Ładowanie...</p>
    </div>
  );
};

export default Loading;
