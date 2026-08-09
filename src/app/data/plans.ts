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
      "Generowanie ze zdjęcia",
      "Styl sprzedażowy (OLX, Vinted, Marketplace)",
      "Kopiowanie jednym kliknięciem",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 15,
    credits: 40,
    aiLimit: 40,
    stripePriceId: process.env.STRIPE_PRICE_STANDARD!,
    badge: "Polecany",
    benefits: [
      "40 opisów AI",
      "Generowanie ze zdjęcia",
      "Styl sprzedażowy (OLX, Vinted, Marketplace)",
      "Kopiowanie jednym kliknięciem",
      "24% taniej za ogłoszenie",
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
      "Generowanie ze zdjęcia",
      "Styl sprzedażowy (OLX, Vinted, Marketplace)",
      "Kopiowanie jednym kliknięciem",
      "42% taniej za ogłoszenie",
      "Dla sprzedających dużo (sklepy/Marketplace)",
    ],
  },
] as const;
