export type PortalId = "olx" | "marketplace";

export interface Portal {
  id: PortalId;
  name: string;
  hint: string;
  titleMax: number;
  descriptionMin: number;
  descriptionMax: number;
  shortMax: number;
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
  },
  {
    id: "marketplace",
    name: "Marketplace",
    hint: "Krótki, sprzedażowy styl pod Facebook Marketplace / Allegro",
    titleMax: 80,
    descriptionMin: 40,
    descriptionMax: 2000,
    shortMax: 160,
  },
];

export const getPortalById = (id: PortalId | string): Portal =>
  portals.find((p) => p.id === id) ?? portals[0];

export const VALID_PORTALS: PortalId[] = ["olx", "marketplace"];
