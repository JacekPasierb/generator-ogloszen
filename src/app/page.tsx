"use client";

import Loading from "./components/Loading/Loading";
import {useUser} from "./hooks/useUser";
import ExGenerator from "./ui/ExGenerator/ExGenerator";
import Hero from "./ui/Hero/Hero";
import Pricing from "./ui/Pricing/Pricing";

const Home = () => {
  const {user, loading} = useUser();

  if (loading) return <Loading />;
  
  return (
    <>
      <Hero />
      <Pricing />
      <ExGenerator />
    </>
  );
};

export default Home;
