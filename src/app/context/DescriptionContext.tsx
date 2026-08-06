"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DescriptionResult {
  description: string;
  title?: string;
  short?: string;
}

interface DescriptionContextProps {
  description: string;
  title?: string;
  short?: string;
  setDescription: (value: string) => void;
  setResult: (r: DescriptionResult) => void;
}

interface DescriptionProviderProps {
  children: ReactNode;
}
const DescriptionContext = createContext<DescriptionContextProps | undefined>(
  undefined
);

export const DescriptionProvider = ({ children }: DescriptionProviderProps) => {
  const [description, setDescriptionState] = useState("");
  const [title, setTitle] = useState<string | undefined>();
  const [short, setShort] = useState<string | undefined>();

  const setDescription = (value: string) => {
    setDescriptionState(value);
    setTitle(undefined);
    setShort(undefined);
  };

  const setResult = (r: DescriptionResult) => {
    setDescriptionState(r.description);
    setTitle(r.title);
    setShort(r.short);
  };

  return (
    <DescriptionContext.Provider
      value={{
        description,
        title,
        short,
        setDescription,
        setResult,
      }}
    >
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
