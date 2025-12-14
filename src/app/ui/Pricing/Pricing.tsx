import React from "react";
import styles from "./Pricing.module.css";
import Title from "../../components/Title/Title";
import SubTitle from "../../components/SubTitle/SubTitle";
import CardProduct from "../../components/CardProduct/CardProduct";

const Pricing = () => {
  return (
    <section className={`section container ${styles.background}`}>
      <div>
        <Title>Postaw na Skuteczność</Title>
        <SubTitle>
          Zobacz dostępne pakiety. Generowanie opisów jest dostępne po aktywacji
          pakietu.
        </SubTitle>
      </div>

      {/* tryb informacyjny */}
      <CardProduct mode="public" />
    </section>
  );
};

export default Pricing;
