import React from "react";
import styles from "./Description.module.css";
import Title from "../../components/Title/Title";
import { useDescription } from "../../context/DescriptionContext";

const Description = () => {
    const {description} = useDescription();
  return (
    <section className={`section container`}>
      <Title>Wygenerowany opis:</Title>
      <textarea readOnly value={description} className={styles.result} ></textarea>
    
    </section>
  );
};

export default Description;
