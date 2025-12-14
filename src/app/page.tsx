"use client";

import {useEffect} from "react";
import Loading from "./components/Loading/Loading";
import {useUser} from "./hooks/useUser";
import ExGenerator from "./ui/ExGenerator/ExGenerator";
import Hero from "./ui/Hero/Hero";
import Pricing from "./ui/Pricing/Pricing";
import {useRouter} from "next/navigation";

const Home = () => {
  const {user, loading} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) return <Loading />;
  if (user) return null;

  return (
    <>
      <Hero />
      <Pricing />
      <ExGenerator />
    </>
  );
};

export default Home;
