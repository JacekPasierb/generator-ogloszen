"use client";

import React, {useEffect} from "react";
import CardAuth from "../components/CardAuth/CardAuth";
import {useUser} from "../hooks/useUser";
import {useRouter} from "next/navigation";

const RegisterPage = () => {
  const {user, loading} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading || user) return null;
  return (
    <section className={`section container`}>
      <CardAuth />
    </section>
  );
};

export default RegisterPage;
