import ExGenerator from "./ui/ExGenerator/ExGenerator";
import Hero from "./ui/Hero/Hero";
import Pricing from "./ui/Pricing/Pricing";

/**
 * Landing jako Server Component — treść (Hero/Pricing/ExGenerator)
 * trafia do HTML dla robotów i pierwszego paintu.
 * Zalogowanych przekierowuje middleware (/ → /dashboard).
 */
const Home = () => {
  return (
    <>
      <Hero />
      <Pricing />
      <ExGenerator />
    </>
  );
};

export default Home;
