// components/Loading/Loading.tsx
import React from "react";
import styles from "./Loading.module.css";

type LoadingProps = {
  label?: string;
};

const Loading = ({ label = "Ładowanie..." }: LoadingProps) => {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true"></div>
      <p className={styles.text}>{label}</p>
    </div>
  );
};

export default Loading;
