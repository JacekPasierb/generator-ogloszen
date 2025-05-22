import React from "react";
import styles from "./Description.module.css";
import Title from "../../components/Title/Title";
import { useDescription } from "../../context/DescriptionContext";

const Description = () => {
    const {description} = useDescription();
  return (
    <section className={`section container`}>
      <Title>Wygenerowany opis:</Title>
      {<p>{description}</p>
    }
    </section>
  );
};

export default Description;
