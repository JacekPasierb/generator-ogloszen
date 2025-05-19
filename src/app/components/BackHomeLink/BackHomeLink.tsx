import Link from "next/link";
import React from "react";
import styles from "./BackHomeLink.module.css"

const BackHomeLink = () => {
  return (
    <Link href="/" className={styles.link}>
      ← Wróć na stronę główną
    </Link>
  );
};

export default BackHomeLink;
