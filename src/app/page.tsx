import HowItWorks from "./ui/HowItWorks/HowItWorks";
import ExGenerator from "./ui/ExGenerator/ExGenerator";
import Hero from "./ui/Hero/Hero";
import Pricing from "./ui/Pricing/Pricing";

/**
 * Landing jako Server Component — treść trafia do HTML dla robotów.
 * Zalogowanych przekierowuje middleware (/ → /dashboard).
 */
const Home = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Pricing />
      <ExGenerator />
    </>
  );
};

export default Home;
