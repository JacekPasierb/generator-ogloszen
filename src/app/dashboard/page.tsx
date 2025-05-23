"use client";

import React, {Suspense, useEffect} from "react";
import Header from "../ui/Header/Header";
import Generator from "../ui/Generator/Generator";
import Description from "../ui/Description/Description";
import Loading from "../components/Loading/Loading";
import {useDescription} from "../context/DescriptionContext";
import {useUser} from "../hooks/useUser";
import {useRouter} from "next/navigation";

const DashboardPage = () => {
  const {description} = useDescription();
  const {user, loading} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading &&!user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <Loading />;
  if (!user) return null;
  return (
    <>
      <Header />
      <Generator />
      {description && description.trim().length > 0 && (
        <Suspense fallback={<Loading />}>
          <Description />
        </Suspense>
      )}
    </>
  );
};

export default DashboardPage;
