# Audyt techniczny i produktowy + Rekomendacja monetyzacji  
**Generator Ogłoszeń** (Next.js, MongoDB, Stripe)

---

## 1. AUDYT TECH + PRODUKT

### 1.1 Mapa funkcji

| Obszar | Stan | Lokalizacja |
|--------|------|-------------|
| **Logowanie** | Email + hasło, JWT w httpOnly cookie (7d) | `api/login`, `api/logout`, `lib/auth/getUserIdFromToken` |
| **Rejestracja** | 1 formularz, 2 trialCredits dla nowych | `api/register` |
| **Płatności** | Stripe Checkout (one-time), webhook aktualizuje plan | `api/checkout-sessions`, `api/stripe/webhook`, `data/plans` |
| **Generowanie** | 1 sztywny prompt, OpenAI, zużycie kredytów (trial→paid) | `api/ai-generate`, `lib/ai/generateDescription.ts`, `lib/db/consumeCredit` |
| **Pakiety** | Start (5 zł/10), Standard (15/40), Pro (29/100) – tylko kredyty, brak subskrypcji | `data/plans.ts` |
| **UI** | Dashboard z formularzem, liczniki kredytów, paywall modal, zapisane opisy | `ui/Generator`, `components/PaywallModal`, `api/descriptions` |
| **Baza** | MongoDB, kolekcja User (plan, aiLimit, aiUsed, trialCredits, savedDescriptions) | `models/User.ts`, `lib/mongoose` |
| **API** | 11 route’ów (auth, me, ai-generate, descriptions, checkout, webhook, plan/reset, migrate) | `app/api/**` |
| **Middleware** | Tylko przekierowania: /dashboard bez tokena → /login; /login z tokenem → /dashboard | `middleware.ts` |
| **Zabezpieczenia** | Rate limit 5 req/60s na userId (in-memory), JWT, bcrypt, walidacja inputu (max 300 znaków), atomowe zużycie kredytów | `lib/rateLimit.ts`, `api/ai-generate` |

### 1.2 Ryzyka

| Ryzyko | Opis | Priorytet |
|--------|------|-----------|
| **Bezpieczeństwo** | Brak CSRF/XSS middleware; migrate endpoint bez auth (GET) – wyłączyć po migracji | Średni |
| **Cookies/JWT** | JWT w httpOnly – OK. Brak refresh tokena (7d wystarczy na MVP) | Niski |
| **Rate limiting** | Tylko in-memory – przy wielu instancjach niespójny; dla MVP OK, docelowo Redis | Średni |
| **Prompt injection** | Jeden prompt, input ograniczony do 300 znaków – ryzyko ograniczone; można dodać sanityzację | Niski |
| **Koszty OpenAI** | Brak limitu per user poza kredytami; brak monitoringu kosztu per request | Wysoki |
| **Brak analityki** | Zero eventów (signup, first_generate, paywall, checkout) – brak danych do optymalizacji lejka | Wysoki |
| **Brak lejka** | Wartość dopiero po rejestracji (2 generacje); brak jasnego “zobacz efekt przed rejestracją” | Wysoki |
| **Retencja** | Jednorazowe pakiety – po wyczerpaniu trzeba “odnów pakiet”; brak maili, powiadomień | Średni |
| **UX paywalla** | User widzi wartość (2 darmowe generacje), potem modal z pakietami – sensowne; brak wyraźnego “ile zostało” przed paywallem | Średni |

### 1.3 Ocena UX paywalla

- **Plusy:** Użytkownik po rejestracji od razu może wygenerować 2 opisy (wartość przed płatnością). Paywall w formie modala z wyborem pakietów, bez agresywnego blokowania.
- **Minusy:** Brak podglądu “jednej generacji bez konta” (np. demo na stronie głównej); licznik “zostało X kredytów” mógłby być bardziej widoczny przed ostatnią generacją.

---

## 2. PROPOZYCJA MONETYZACJI

### Wariant A: Free trial (np. 3 generacje / 7 dni)

- **Opis:** 3 generacje w ciągu 7 dni od rejestracji, potem paywall.
- **Plusy:** Prosty komunikat, ograniczony w czasie – zachęca do decyzji.
- **Minusy:** Wymaga śledzenia “pierwszego logowania” i okna 7 dni; obecny model (2 kredyty na stałe) jest prostszy.

### Wariant B: Freemium (np. 2 generacje dziennie + watermark)

- **Opis:** 2 generacje dziennie za darmo, opcjonalnie watermark na tekście.
- **Plusy:** Ciągły kontakt z produktem, nawyk.
- **Minusy:** Złożoność (limit dzienny, reset), watermark może irytować; trudniejsze w utrzymaniu.

### Wariant C: Tanie wejście (9–19 zł Starter) + upsell

- **Opis:** Niski próg wejścia (np. Starter 9 zł / 15 opisów), potem komunikaty “wykorzystałeś 80%, doładuj pakiet”.
- **Plusy:** Niższa bariera, więcej konwersji; upsell naturalny przy limicie.
- **Minusy:** Wymaga nowej ceny w Stripe i ewentualnie nowego produktu.

### Wariant D: Obecny model (2 trial + pakiety kredytów jednorazowe)

- **Opis:** Tak jak teraz: 2 darmowe kredyty, potem Start/Standard/Pro (jednorazowa płatność, brak subskrypcji).
- **Plusy:** Już wdrożone, proste, przewidywalne dla użytkownika. Łatwo dodać limity czasowe (np. free: 3 generacje/tydzień) bez zmiany cennika.
- **Minusy:** Brak automatycznej powtórki przychodu (subskrypcja).

### Rekomendacja dla aktualnego kodu

**Wariant D + lekkie rozszerzenie:**  
Zostawić obecny model (2 trial + pakiety jednorazowe). Dodać:

1. **Limity okresowe dla free:** np. 3 generacje na tydzień (oprócz 2 trial łącznie) – albo uprość: “free ma tylko trialCredits (2), bez limitu tygodniowego” – żeby nie komplikować na start.
2. **Starter tani (9 zł)** jako opcję w `plans` – opcjonalnie w kolejnej iteracji.
3. **Analitykę zdarzeń** – żeby móc mierzyć: signup → first_generate → paywall_view → checkout_start → purchase i na tej podstawie zdecydować o zmianie modelu (np. freemium lub subskrypcja).

Dzięki temu wdrożenie jest **szybkie**, **bez przebudowy płatności**, z **konwersją mierzalną**.

---

## 3. NOWE FUNKCJE (MVP) – do wdrożenia

1. **Szablony branżowe** – wybór kategorii (sprzedaż auta, wynajem, praca, usługi) + osobne prompty. Zwiększa perceived value i dopasowanie wyniku.
2. **Generator tytułów + wersje krótkie/długie** – jeden request może zwracać: tytuł + opis krótki + opis długi (lub “formalnie/luźno”). Więcej wartości na jednym kredycie.
3. **Podgląd i historia** – lista ostatnich wygenerowanych (np. 10) z kopiuj/eksport; część już jest (savedDescriptions), rozszerzyć o “ostatnie bez zapisania” albo lepszy UX listy zapisanych.
4. **Licznik znaków / dopasowanie pod OLX** – podpowiedź “idealne pod OLX (do X znaków)” przy polu lub przy wyniku.
5. **Analityka eventów** – tabela w MongoDB (events) + endpoint do podglądu (lub prosty ekran w dashboardzie).

W pierwszej kolejności wdrożone zostaną: **szablony branżowe**, **generator tytułów + wersje**, **lepszy licznik/limit znaków w UI** oraz **analityka eventów**.

---

## 4. LIMITOWANIE (trial/freemium)

- **Free (tylko trialCredits):** 2 generacje łącznie (obecne zachowanie).
- **Start/Standard/Pro:** limit = aiLimit z planu (obecne zachowanie).
- **Server-side:** API generowania już sprawdza kredyty i zużycie (consumeCredit); bez zmian logiki.
- **Rate limiting:** już jest (5 req/60s) – zostawić.
- **UX:** Komunikaty “Zostało X kredytów”, “Wykorzystałeś trial – wybierz pakiet” – upewnić się, że są widoczne (liczniki w Header/Generator już są).

Ewentualne rozszerzenie: pole `freeGenerationsUsedThisWeek` + reset co tydzień – do TODO na później, żeby nie komplikować MVP.

---

## 5. STRIPE I PŁATNOŚCI

- **Webhook jako źródło prawdy:** Już tak jest – po `checkout.session.completed` ustawiany jest plan i aiLimit. Nie zmieniamy.
- **Uporządkowanie:** Upewnić się, że w Stripe Dashboard produkty/ceny mają poprawne ID w `.env` (STRIPE_PRICE_*). Dodać stronę **Billing/Account**: aktualny plan, użycie (aiUsed/aiLimit), link “Wybierz pakiet” – bez zarządzania subskrypcją (jej nie ma).

---

## 6. ANALITYKA

- **Eventy:** signup, first_generate, paywall_view, checkout_start, purchase (plus np. template_selected).
- **MVP:** Zapis do kolekcji MongoDB `events` (userId, event, payload, createdAt). Endpoint GET `/api/admin/events` (z prostym kluczem lub bez dostępu na produkcji) lub strona `/dashboard/billing` z ostatnimi eventami użytkownika (własne).
- **Bezpieczeństwo:** Nie logować wrażliwych danych (hasła, pełne opisy); tylko typ eventu i id użytkownika / planId.

---

## 7. PODSUMOWANIE REKOMENDACJI

| # | Działanie | Cel |
|---|-----------|-----|
| 1 | Szablony branżowe + osobne prompty | Więcej wartości, lepsza konwersja |
| 2 | Generator tytułów + wersje krótkie/długie | Więcej na jeden kredyt |
| 3 | Licznik znaków / hint OLX | Lepsze UX, mniej błędów |
| 4 | Limity – zostawić jak są (trial 2 + paid) | Bez komplikacji |
| 5 | Strona Billing/Account | Jasność dla użytkownika, zaufanie |
| 6 | Analityka eventów (MongoDB + podgląd) | Dane do optymalizacji lejka |
| 7 | Dokumentacja + checklista + szacunek kosztów | Utrzymanie i kontrola kosztów |

Kolejność wdrożenia w kodzie: najpierw **analityka (eventy)**, potem **szablony + tytuły + licznik**, na końcu **Billing/Account** i **dokumentacja**.
