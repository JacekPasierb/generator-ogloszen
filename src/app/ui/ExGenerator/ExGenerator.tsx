import React from "react";
import styles from "./ExGenerator.module.css";
import Title from "../../components/Title/Title";
import SubTitle from "../../components/SubTitle/SubTitle";
import {examples} from "../../data/exGenerators";
import CardGenerator from "../../components/CardGenerator/CardGenerator";

const ExGenerator = () => {
  return (
    <section className={`section container`}>
      <div>
        <Title> Jak może wyglądać Twój opis ?</Title>
        <SubTitle>
        Zobacz, jak wyglądają przykładowe opisy tworzone przez AI — krótkie, konkretne i skuteczne.
        </SubTitle>
      </div>
      <div className={styles.cardsWrapper}>
        {examples.length === 0 ? (
          <p>Brak przykładów do wyświetlenia.</p>
        ) : (
          examples.map((ex, index) => (
            <CardGenerator key={index} example={ex} />
          ))
        )}
      </div>
    </section>
  );
};

export default ExGenerator;
