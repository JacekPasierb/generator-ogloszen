export type PortalId = "olx" | "allegro" | "vinted" | "marketplace";

export interface Portal {
  id: PortalId;
  name: string;
  /** Krótkie tagi / chmurki pod wyborem portalu */
  tips: string[];
  titleMax: number;
  descriptionMin: number;
  descriptionMax: number;
  shortMax: number;
  tone: string;
}

export const portals: Portal[] = [
  {
    id: "olx",
    name: "OLX",
    tips: ["Tytuł ≤150", "Opis 40–9000", "Chwytliwy ton"],
    titleMax: 150,
    descriptionMin: 40,
    descriptionMax: 9000,
    shortMax: 160,
    tone: "ogłoszeniowy, bezpośredni, zachęcający do kontaktu",
  },
  {
    id: "allegro",
    name: "Allegro",
    tips: ["Tytuł ≤75", "Opis do 4000", "Cechy + parametry"],
    titleMax: 75,
    descriptionMin: 40,
    descriptionMax: 4000,
    shortMax: 160,
    tone: "e-commerce, konkretne cechy, parametry, CTA kupna",
  },
  {
    id: "vinted",
    name: "Vinted",
    tips: ["Tytuł ≤100", "Opis ~1000", "Luźny styl moda"],
    titleMax: 100,
    descriptionMin: 40,
    descriptionMax: 1000,
    shortMax: 120,
    tone: "luźny, przyjacielski, moda i second-hand",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    tips: ["Tytuł ≤80", "Opis do 2000", "Krótko + CTA"],
    titleMax: 80,
    descriptionMin: 40,
    descriptionMax: 2000,
    shortMax: 160,
    tone: "zwięzły, sprzedażowy, lokalny odbiór",
  },
];

export const getPortalById = (id: PortalId | string): Portal =>
  portals.find((p) => p.id === id) ?? portals[0];

export const VALID_PORTALS: PortalId[] = [
  "olx",
  "allegro",
  "vinted",
  "marketplace",
];
