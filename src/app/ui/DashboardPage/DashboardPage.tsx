import React from "react";
import Header from "../Header/Header";
import Generator from "../Generator/Generator";
import Description from "../Description/Description";
import { DescriptionProvider } from "../../context/DescriptionContext";

const DashboardPage = () => {
  return (
    <>
      <Header />
      <DescriptionProvider>
        <Generator />
        <Description />
      </DescriptionProvider>
    </>
  );
};

export default DashboardPage;
