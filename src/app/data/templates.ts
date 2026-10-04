import type { PortalId } from "./portals";

export type TemplateId =
  | "default"
  | "car"
  | "rental"
  | "job"
  | "services";

export interface Template {
  id: TemplateId;
  name: string;
  promptPrefix: string;
  hint?: string;
  /** Brak = dostępny na wszystkich portalach */
  portals?: PortalId[];
}

export const templates: Template[] = [
  {
    id: "default",
    name: "Sprzedaż",
    promptPrefix:
      "Stwórz atrakcyjne ogłoszenie sprzedaży. Podkreśl stan, kluczowe cechy, cenę (jeśli podana) i wezwanie do kontaktu. Nie zmyślaj faktów.",
    hint: "Rzeczy, elektronika, moda, wyposażenie.",
  },
  {
    id: "car",
    name: "Samochód",
    promptPrefix:
      "Stwórz ogłoszenie sprzedaży samochodu. Uwzględnij: markę, model, rok, przebieg, stan, wyposażenie i zalety — tylko jeśli są w danych. Styl zwięzły, zachęcający do kontaktu.",
    hint: "Auto, motocykl, części.",
    portals: ["olx", "allegro", "marketplace"],
  },
  {
    id: "rental",
    name: "Wynajem",
    promptPrefix:
      "Stwórz ogłoszenie wynajmu (mieszkanie, pokój, lokal). Uwzględnij: lokalizację, metraż, wyposażenie, czynsz i dostępność — tylko jeśli są w danych. Ton profesjonalny, zachęcający.",
    hint: "Mieszkanie, pokój, lokal.",
    portals: ["olx", "marketplace"],
  },
  {
    id: "job",
    name: "Praca",
    promptPrefix:
      "Stwórz ogłoszenie rekrutacyjne. Uwzględnij: stanowisko, obowiązki, wymagania, warunki i sposób aplikacji — tylko jeśli są w danych. Ton formalny, zachęcający.",
    hint: "Oferta pracy / współpraca.",
    portals: ["olx"],
  },
  {
    id: "services",
    name: "Usługi",
    promptPrefix:
      "Stwórz ogłoszenie usługi lokalnej (np. remont, sprzątanie, naprawy). Podkreśl korzyści, rejon działania i kontakt — bez zmyślania. Ton przyjazny, budujący zaufanie.",
    hint: "Fachowcy, naprawy, lokalne usługi.",
    portals: ["olx", "allegro", "marketplace"],
  },
];

export const VALID_TEMPLATES: TemplateId[] = templates.map((t) => t.id);

export const getTemplateById = (id: TemplateId | string): Template =>
  templates.find((t) => t.id === id) ?? templates[0];

export const getTemplatesForPortal = (portalId: string): Template[] =>
  templates.filter((t) => !t.portals || t.portals.includes(portalId as PortalId));
