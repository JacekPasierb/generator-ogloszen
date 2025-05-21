"use client"

import { useUser } from "./hooks/useUser";
import DashboardPage from "./ui/DashboardPage/DashboardPage";
import LandingPage from "./ui/LandingPage/LandingPage";

const Home = () => {
  const {user, loading} = useUser();

  if (loading) return <p>Ładowanie...</p>;
  return (
    <>
      {user ? <DashboardPage /> : <LandingPage />}
    </>
  );
};

export default Home;
