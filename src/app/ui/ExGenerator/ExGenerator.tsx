import React from "react";
import Title from "../../components/Title/Title";
import SubTitle from "../../components/SubTitle/SubTitle";

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
    </section>
  );
};

export default ExGenerator;
