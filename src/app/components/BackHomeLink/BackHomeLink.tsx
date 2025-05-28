import Link from "next/link";
import React from "react";
import styles from "./BackHomeLink.module.css";

const BackHomeLink = () => {
  return (
    <Link
      href="/"
      className={styles.link}
      aria-label="Powrót na stronę główną"
      title="Powrót na stronę główną"
    >
      ← Wróć na stronę główną
    </Link>
  );
};

export default BackHomeLink;
