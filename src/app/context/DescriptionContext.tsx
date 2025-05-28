"use client";

import React, {createContext, useContext, useState, ReactNode} from "react";

interface DescriptionContextProps {
  description: string;
  setDescription: (value: string) => void;
}

interface DescriptionProviderProps {
  children: ReactNode;
}
const DescriptionContext = createContext<DescriptionContextProps | undefined>(
  undefined
);

export const DescriptionProvider = ({children}: DescriptionProviderProps) => {
  const [description, setDescription] = useState("");

  return (
    <DescriptionContext.Provider value={{description, setDescription}}>
      {children}
    </DescriptionContext.Provider>
  );
};

export const useDescription = () => {
  const context = useContext(DescriptionContext);
  if (!context) {
    throw new Error("useDescription must be used within a DescriptionProvider");
  }
  return context;
};
