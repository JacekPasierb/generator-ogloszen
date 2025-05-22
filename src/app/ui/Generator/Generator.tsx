import React from "react";
import styles from "./Generator.module.css"
import Title from "../../components/Title/Title";
import FormGenerator from "../../components/FormGenerator/FormGenerator";

const Generator = () => {
  return (
    <section className={`section container ${styles.generator}`}>
      <Title>Stwórz opis AI </Title>
      <FormGenerator/>
    </section>
  );
};

export default Generator;
