"use client";

import React from "react";
import styles from "./CardAuth.module.css";
import Image from "next/image";
import {usePathname} from "next/navigation";
import Title from "../Title/Title";
import SubTitle from "../SubTitle/SubTitle";
import LoginForm from "../LoginForm/LoginForm";
import RegisterLink from "../RegisterLink/RegisterLink";
import BackHomeLink from "../BackHomeLink/BackHomeLink";
import RegisterForm from "../RegisterForm/RegisterForm";

const CardAuth = () => {
  const pathname = usePathname();
  const isRegister = pathname.startsWith("/register");
  return (
    <div className={styles.cardAuth}>
      <Image
        src="/logo.png"
        width={80}
        height={80}
        alt="logo"
        className={styles.logo}
      />

      <Title>{isRegister ? "Załóż konto" : "Zaloguj się do konta"}</Title>
      <SubTitle>Uzyskaj dostęp do opisów AI</SubTitle>
      {isRegister ? <RegisterForm /> : <LoginForm />}
      <RegisterLink />
      <BackHomeLink />
    </div>
  );
};

export default CardAuth;
