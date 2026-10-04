"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ListingVariant {
  label: string;
  title: string;
  long: string;
}

export interface DescriptionResult {
  description: string;
  title?: string;
  short?: string;
  keywords?: string[];
  features?: string[];
  checklist?: string[];
  variants?: ListingVariant[];
}

interface DescriptionContextProps {
  description: string;
  title?: string;
  short?: string;
  keywords: string[];
  features: string[];
  checklist: string[];
  variants: ListingVariant[];
  setDescription: (value: string) => void;
  setTitle: (value: string | undefined) => void;
  setResult: (r: DescriptionResult) => void;
  /** Aktualizuje tylko tytuł/opis (np. po rewrite) — bez kasowania cech/wariantów */
  patchText: (r: { description: string; title?: string }) => void;
  applyVariant: (index: number) => void;
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
  const [keywords, setKeywords] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [variants, setVariants] = useState<ListingVariant[]>([]);

  const setDescription = (value: string) => {
    setDescriptionState(value);
    setTitle(undefined);
    setShort(undefined);
    setKeywords([]);
    setFeatures([]);
    setChecklist([]);
    setVariants([]);
  };

  const setResult = (r: DescriptionResult) => {
    setDescriptionState(r.description);
    setTitle(r.title);
    setShort(r.short);
    setKeywords(r.keywords ?? []);
    setFeatures(r.features ?? []);
    setChecklist(r.checklist ?? []);
    setVariants(r.variants ?? []);
  };

  const patchText = (r: { description: string; title?: string }) => {
    setDescriptionState(r.description);
    if (r.title !== undefined) setTitle(r.title);
  };

  const applyVariant = (index: number) => {
    const v = variants[index];
    if (!v) return;
    setDescriptionState(v.long);
    setTitle(v.title || undefined);
  };

  return (
    <DescriptionContext.Provider
      value={{
        description,
        title,
        short,
        keywords,
        features,
        checklist,
        variants,
        setDescription,
        setTitle,
        setResult,
        patchText,
        applyVariant,
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
