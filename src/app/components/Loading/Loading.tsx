// components/Loading/Loading.tsx
import React from "react";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Ładowanie...</p>
    </div>
  );
};

export default Loading;
