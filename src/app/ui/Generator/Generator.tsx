import React from "react";
import styles from "./Generator.module.css";
import Title from "../../components/Title/Title";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import {useUser} from "../../hooks/useUser";

const Generator = () => {
  const {isPro} = useUser();
  return (
    <section
      className={`section container  ${
        !isPro ? styles.locked : styles.generator
      }`}
    >
      <Title>Stwórz opis AI </Title>
      {isPro && <FormGenerator />}
    </section>
  );
};

export default Generator;
