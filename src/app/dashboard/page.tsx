"use client";

import React, {Suspense, useEffect} from "react";
import Header from "../ui/Header/Header";
import Generator from "../ui/Generator/Generator";
import Description from "../ui/Description/Description";
import Loading from "../components/Loading/Loading";
import {useDescription} from "../context/DescriptionContext";
import {useUser} from "../hooks/useUser";
import {useRouter} from "next/navigation";
import dynamic from "next/dynamic";
const SessionHandler = dynamic(
  () => import("../components/SessionHandler/SessionHandler"),
  {
    ssr: false,
  }
);
const DashboardPage = () => {
  const {description} = useDescription();
  const {user} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  if (user === undefined) return <Loading label="Sprawdzam sesję..." />;
  if (user === null) return <Loading label="Przekierowuję..."/>;
  
  return (
    <>
      <SessionHandler />
      <Header />
      <Generator />
      {description?.trim() && (
        <Suspense fallback={<Loading label="Ładuję podgląd..." />}>
          <Description />
        </Suspense>
      )}
    </>
  );
};

export default DashboardPage;
