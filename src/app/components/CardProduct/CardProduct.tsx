import React from "react";
import styles from "./CardProduct.module.css";
import Link from "next/link";
import {benefits} from "../../data/benefit";

const CardProduct = () => {
  return (
    <div className={styles.card}>
      <div>
        <h3 className={styles.title}>Pakiet AI</h3>
        <p className={styles.price}>Tylko 5 zł</p>
      </div>

      <ul className={styles.benefitsList}>
        {benefits.map((benefit, index) => (
          <li key={index}>
            <p className={styles.benefit}>{benefit}</p>
          </li>
        ))}
      </ul>
      <Link href="/register" className={styles.cta}>
        Załóż konto i aktywuj
      </Link>
    </div>
  );
};

export default CardProduct;
