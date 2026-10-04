export type PortalId = "olx" | "allegro" | "vinted" | "marketplace";

export interface Portal {
  id: PortalId;
  name: string;
  hint: string;
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
    hint: "Chwytliwy tytuł do 150 znaków · opis 40–9000 znaków",
    titleMax: 150,
    descriptionMin: 40,
    descriptionMax: 9000,
    shortMax: 160,
    tone: "ogłoszeniowy, bezpośredni, zachęcający do kontaktu",
  },
  {
    id: "allegro",
    name: "Allegro",
    hint: "Tytuł z cechami · opis z bulletami i parametrami",
    titleMax: 75,
    descriptionMin: 40,
    descriptionMax: 4000,
    shortMax: 160,
    tone: "e-commerce, konkretne cechy, parametry, CTA kupna",
  },
  {
    id: "vinted",
    name: "Vinted",
    hint: "Luźny, krótki styl moda/używane · max ~1000 znaków",
    titleMax: 100,
    descriptionMin: 40,
    descriptionMax: 1000,
    shortMax: 120,
    tone: "luźny, przyjacielski, moda i second-hand",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    hint: "Krótki styl Facebook Marketplace · cechy + CTA",
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
