# Wdrożenie i następne kroki – Generator Ogłoszeń

## Co zostało zrobione (plan wdrożenia)

### 1. Audyt i rekomendacja
- **docs/AUDIT_AND_MONETIZATION.md** – mapa funkcji, ryzyka, ocena UX paywalla, 4 warianty monetyzacji, rekomendacja (obecny model + analityka).

### 2. Szablony branżowe
- **src/app/data/templates.ts** – 6 szablonów: Ogólny, Samochód, Wynajem mieszkania, Oferta pracy, Usługi lokalne, Marketplace.
- **src/app/lib/ai/generateDescription.ts** – przyjmuje `templateId` i `outputFormat` ("simple" | "full"), buduje prompt z szablonu.
- **FormGenerator** – select szablonu, checkbox „Tytuł + wersja krótka i długa”.
- **api/ai-generate** – body: `input`, `templateId`, `outputFormat`; walidacja `templateId`; max input 500 znaków.

### 3. Generator tytułów + wersje krótkie/długie
- Przy `outputFormat: "full"` API zwraca `title`, `short`, `long` (jedno wywołanie OpenAI, jeden kredyt).
- **DescriptionContext** – rozszerzony o `title`, `short`, `setResult({ description, title?, short? })`.
- **Description.tsx** – wyświetla tytuł i wersję krótką (jeśli są), potem pełny opis.

### 4. Licznik znaków / OLX
- Limit inputu 500 znaków; pod formularzem: „Po wygenerowaniu: opis do ~750 znaków idealny pod OLX / Facebook”.
- Walidacja Yup: max 500 znaków.

### 5. Limity i rate limiting
- Bez zmian: free = 2 trialCredits; Start/Standard/Pro = aiLimit z planu. Zużycie atomowe (trial → paid).
- Rate limiting: 5 req/60s na userId (in-memory) na **POST /api/ai-generate**.

### 6. Analityka eventów
- **Model Event** – `userId`, `event`, `payload`, `createdAt`; kolekcja `events`.
- **trackEvent(event, { userId?, payload? })** – zapis do MongoDB.
- Eventy: **signup** (register), **generate** (ai-generate), **checkout_start** (checkout-sessions), **purchase** (webhook), **paywall_view** (frontend), **template_selected** (do użycia w przyszłości).
- **POST /api/events** – rejestracja eventów z frontu (tylko paywall_view, template_selected).
- **GET /api/events?limit=50&event=** – podgląd eventów zalogowanego użytkownika (użyte na stronie Billing).

### 7. Stripe i Billing
- **Webhook** – po `checkout.session.completed` ustawiane: plan, aiLimit, aiUsed: 0, **planActivatedAt: new Date()**; wywołanie **trackEvent("purchase", { userId, payload: { planId } })**.
- **Strona /dashboard/billing** – aktualny plan, użycie (trial/paid), link „Wybierz pakiet”, lista ostatnich eventów użytkownika.
- W **Header** dodany link „Konto” → /dashboard/billing.

---

## Instrukcja uruchomienia

1. **Środowisko**
   - Node 18+, npm/pnpm.
   - `.env.local`: `MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `OPENAI_MODEL` (opcjonalnie, domyślnie gpt-3.5-turbo), `STRIPE_SECRET_KEY`, `STRIPE_PRICE_START`, `STRIPE_PRICE_STANDARD`, `STRIPE_PRICE_PRO`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`.

2. **Baza**
   - MongoDB – używane kolekcje: `users`, `events` (tworzona przy pierwszym evencie).

3. **Uruchomienie**
   - `npm install` → `npm run dev` (np. http://localhost:3000).
   - Stripe webhook: w Dashboard ustaw URL na `https://<domena>/api/stripe/webhook` i skopiuj signing secret do `STRIPE_WEBHOOK_SECRET`.

4. **Migracja (opcjonalnie)**
   - Dla istniejących użytkowników bez pola `trialCredits`: jednorazowo GET `/api/migrate/trial-credits`. Potem endpoint wyłączyć lub zabezpieczyć.

---

## TODO – następne kroki (max 10)

1. **Analityka** – agregacja eventów (np. signup → first generate → paywall → purchase) w jednym widoku lub export CSV (np. GET /api/admin/events z prostym kluczem API).
2. **Koszty OpenAI** – logowanie tokenów (input/output) per request lub szacunek na podstawie długości; alert przy przekroczeniu miesięcznego budżetu.
3. **Rate limit** – przy wielu instancjach przenieść na Redis (np. `ioredis` + okno 60s).
4. **Starter 9 zł** – opcjonalnie nowy plan w `plans.ts` i nowy Stripe Price ID.
5. **Limity okresowe dla free** – np. 3 generacje/tydzień (pole `freeGenerationsUsedThisWeek`, reset co poniedziałek) – po decyzji produktowej.
6. **Migrate endpoint** – usunąć lub zabezpieczyć (np. API key lub wyłączyć po wykonaniu migracji).
7. **E-maile** – powitalny po rejestracji, „wykorzystałeś 80% kredytów”, „pakiet wyczerpany” (np. Resend/SendGrid).
8. **A/B warianty** – generuj 3 wersje w jednym wywołaniu, UI „wybierz najlepszą” (więcej tokenów = wyższy koszt).
9. **Multi-language** – parametr język (PL/EN) w promptach i w UI.
10. **Panel admin** – lista użytkowników, ostatnie eventy, suma purchase (tylko z uprawnieniami).

---

## Szacunkowy koszt generacji (kontrola kosztów)

- **Model:** np. gpt-3.5-turbo (ok. $0.0015 / 1K tokenów wejście, $0.002 / 1K wyjście) lub gpt-4o-mini (tańszy).
- **Średnio:** 1 generacja ≈ 200–400 tokenów wejścia (prompt + szablon + input) + 150–400 wyjścia (opis). Dla gpt-3.5-turbo: rząd wielkości **&lt; 1 centa USD** za 1 opis.
- **Format „full” (tytuł + short + long):** ok. 2× tokenów wyjścia → nadal &lt; 2 centy USD.
- **Rekomendacja:** w cronie lub po N requestach dziennie przeliczać szacunek (np. liczba generacji × 0.01 USD) i zapisywać do kolekcji `daily_costs` lub logu; przy przekroczeniu progu – alert (e-mail/Slack).

Formuła szacunku (do wdrożenia w przyszłości):

```
szacunek_kosztu_miesiąc = liczba_generacji_miesiąc × 0.01 USD
```

Dla 1000 generacji/mies. ≈ 10 USD. Należy okresowo weryfikować cennik OpenAI i dostosować mnożnik.
