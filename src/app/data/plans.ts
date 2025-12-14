export type PlanId = "start" | "standard" | "pro";

export const plans = [
  {
    id: "start",
    name: "Start",
    price: 5,
    credits: 10,
    aiLimit: 10,
    stripePriceId: process.env.STRIPE_PRICE_START!,
    badge: "Na start",
    benefits: [
      "10 opisów AI",
      "Styl sprzedażowy (OLX, Vinted, Marketplace)",
      "Kopiuj i wklej od razu do ogłoszenia",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 15,
    credits: 40,
    aiLimit: 40,
    stripePriceId: process.env.STRIPE_PRICE_STANDARD!,
    badge: "Najczęściej wybierany",
    benefits: [
      "40 opisów AI",
      "Styl sprzedażowy (OLX, Vinted, Marketplace)",
      "Kopiuj i wklej od razu do ogłoszenia",
      "Lepsza cena za opis",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    credits: 100,
    aiLimit: 100,
    stripePriceId: process.env.STRIPE_PRICE_PRO!,
    badge: "Najlepsza cena",
    benefits: [
      "100 opisów AI",
      "Styl sprzedażowy (OLX, Vinted, Marketplace)",
      "Kopiuj i wklej od razu do ogłoszenia",
      "Najniższa cena za opis",
      "Dla sprzedających dużo (sklepy/Marketplace)",
    ],
  },
] as const;
