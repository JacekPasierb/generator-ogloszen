export type TemplateId =
  | "default"
  | "car"
  | "rental"
  | "job"
  | "services"
  | "marketplace";

export interface Template {
  id: TemplateId;
  name: string;
  promptPrefix: string;
  hint?: string;
}

export const templates: Template[] = [
  {
    id: "default",
    name: "Ogólny (sprzedaż)",
    promptPrefix:
      "Na podstawie poniższego opisu stwórz atrakcyjne ogłoszenie sprzedaży w stylu marketingowym (OLX, Vinted, Facebook Marketplace).",
    hint: "Uniwersalny styl na dowolne ogłoszenie.",
  },
  {
    id: "car",
    name: "Samochód",
    promptPrefix:
      "Na podstawie poniższego opisu stwórz profesjonalne ogłoszenie sprzedaży samochodu. Uwzględnij: markę, model, rok, przebieg, stan, zalety. Styl zwięzły, zachęcający do kontaktu (OLX/Motoryzacja).",
    hint: "Sprzedaż auta – dopasowane pod portale motoryzacyjne.",
  },
  {
    id: "rental",
    name: "Wynajem mieszkania",
    promptPrefix:
      "Na podstawie poniższego opisu stwórz atrakcyjne ogłoszenie wynajmu mieszkania/lokalu. Uwzględnij: lokalizację, metraż, wyposażenie, cenę, dostępność. Styl zachęcający, profesjonalny (OLX/Nieruchomości).",
    hint: "Wynajem – mieszkanie, pokój, dom.",
  },
  {
    id: "job",
    name: "Oferta pracy",
    promptPrefix:
      "Na podstawie poniższego opisu stwórz ogłoszenie rekrutacyjne (oferta pracy). Uwzględnij: stanowisko, wymagania, oferowane warunki, sposób aplikacji. Styl formalny, zachęcający (LinkedIn/Pracuj.pl).",
    hint: "Rekrutacja – oferta pracy.",
  },
  {
    id: "services",
    name: "Usługi lokalne",
    promptPrefix:
      "Na podstawie poniższego opisu stwórz ogłoszenie oferty usług (np. hydraulik, sprzątanie, remont). Podkreśl korzyści, rejon działania, kontakt. Styl przyjazny, zaufanie (OLX Usługi).",
    hint: "Usługi – fachowcy, sprzątanie, naprawy.",
  },
  {
    id: "marketplace",
    name: "Marketplace / e-commerce",
    promptPrefix:
      "Na podstawie poniższego opisu stwórz krótkie, sprzedażowe ogłoszenie produktu pod Facebook Marketplace / Allegro. Zwięzły tytuł + opis z cechami i CTA.",
    hint: "Szybka sprzedaż – Marketplace, Allegro.",
  },
];

export const getTemplateById = (id: TemplateId | string): Template =>
  templates.find((t) => t.id === id) ?? templates[0];
