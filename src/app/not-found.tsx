import Image from "next/image";
import React from "react";
import Title from "./components/Title/Title";
import BackHomeLink from "./components/BackHomeLink/BackHomeLink";

const NotFound = () => {
  return (
    <section className={`section container centered`}>
      <div>
        <Image
          src="/logo.png"
          width={300}
          height={300}
          alt="logo GO"
          className={`logoError`}
        />

        <Title>404</Title>
        <Title> Ta strona nie istnieje.</Title>
        <p>Sprawdź, czy adres jest poprawny lub wróć do strony głównej.</p>
      </div>
      <BackHomeLink />
    </section>
  );
};

export default NotFound;
