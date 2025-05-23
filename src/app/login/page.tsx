"use client";

import React, {useEffect} from "react";
import CardAuth from "../components/CardAuth/CardAuth";
import {useUser} from "../hooks/useUser";
import {useRouter} from "next/navigation";
import Loading from "../components/Loading/Loading";

const LoginPage = () => {
  const {user, loading} = useUser();
  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && user) {
  //     router.push("/dashboard");
  //   }
  // }, [loading, user, router]);

  // if (loading) return <Loading />;

  // if (user) return null;
  return (
    <section className={`section container`}>
      <CardAuth />
    </section>
  );
};

export default LoginPage;
