import React from "react";
import styles from "./Pricing.module.css";
import Title from "../../components/Title/Title";
import SubTitle from "../../components/SubTitle/SubTitle";
import CardProduct from "../../components/CardProduct/CardProduct";

const Pricing = () => {
  return (
    <section className={`section container ${styles.background} `}>
      <div>
        <Title> Postaw na Profesjonalizm</Title>
        <SubTitle>
          Aktywuj Pakiet AI i zyskaj dostęp do 50 opisów generowanych przez
          sztuczną inteligencję – gotowych w kilka sekund.
        </SubTitle>
      </div>
      <CardProduct />
    </section>
  );
};

export default Pricing;
