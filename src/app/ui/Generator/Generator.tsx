import React from "react";
import styles from "./Generator.module.css"
import Title from "../../components/Title/Title";

const Generator = () => {
  return (
    <section className={`section container ${styles.generator}`}>
      <Title>Stwórz opis AI </Title>
    </section>
  );
};

export default Generator;
