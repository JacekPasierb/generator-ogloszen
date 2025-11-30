import React from "react";
import styles from "./Pricing.module.css";
import Title from "../../components/Title/Title";
import SubTitle from "../../components/SubTitle/SubTitle";
import CardProduct from "../../components/CardProduct/CardProduct";

const Pricing = () => {
  return (
    <section className={`section container ${styles.background} `}>
      <div>
        <Title> Postaw na Skuteczność</Title>
        <SubTitle>
          Odblokuj Pakiet AI i generuj profesjonalne opisy, które pomogą Ci
          szybciej sprzedawać na OLX, Vinted, Marketplace i w sklepach online.
        </SubTitle>
      </div>
      <CardProduct />
    </section>
  );
};

export default Pricing;
