# Changelog

## [0.2.0] – 2025-12-14

### 🚀 Nowości
- Dodano 3 pakiety: Start, Standard, Pro
- Jednorazowe płatności (bez subskrypcji)
- Integracja Stripe z BLIK (PLN)

### 💳 Płatności
- 3 osobne produkty w Stripe
- Webhook Stripe (checkout.session.completed)
- Automatyczna aktywacja pakietu po płatności

### 👤 Konto użytkownika
- Nowy system planów (free / start / standard / pro)
- Limity AI zależne od pakietu
- Licznik pozostałych zapytań

### 🧠 Generator AI
- Nowy premium layout formularza
- Ochrona backendowa (brak dostępu bez pakietu)
- Poprawiona obsługa błędów

### 🖥 Dashboard
- Status konta z nazwą pakietu
- Informacja o zużyciu limitu AI
- Lepszy UX po płatności (bez refreshy)

### 🧱 Architektura
- Centralna definicja planów (`data/plans.ts`)
- Przebudowany model User (MongoDB)
- Refaktoryzacja `useUser` (single source of truth)

### 🛠 Techniczne
- Aktualizacja Next.js (security fix)
- Poprawki TypeScript / ESLint
- Stabilny build na Netlify..
