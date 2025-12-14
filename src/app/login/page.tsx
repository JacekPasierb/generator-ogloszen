"use client";

import React, { useEffect } from "react";
import CardAuth from "../components/CardAuth/CardAuth";
import { useUser } from "../hooks/useUser";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading/Loading";

const LoginPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  // jeszcze nie wiemy czy jest sesja
  if (user === undefined || loading ) return <Loading />;

  // user === null -> pokaż formularz
  return (
    <section className="section container">
      <CardAuth />
    </section>
  );
};

export default LoginPage;
