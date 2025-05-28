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
        <Title> Jak może wyglądać Twój opis ogłoszenia?</Title>
        <SubTitle>
          Poniżej kilka przykładów wygenerowanych przez AI – szybko, konkretnie
          i skutecznie.
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
