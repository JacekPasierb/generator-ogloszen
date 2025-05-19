import Image from "next/image";
import React from "react";
import Title from "./components/Title/Title";
import BackHomeLink from "./components/BackHomeLink/BackHomeLink";

const notfound = () => {
  return (
    <section className={`section container`} style={{flex: 1, justifyContent:"center", alignItems:"center"}}>
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
      </div>
      <BackHomeLink />
    </section>
  );
};

export default notfound;
