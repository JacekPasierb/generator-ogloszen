# 📢 Generator Ogłoszeń – aplikacja SaaS

Aplikacja webowa typu **SaaS (Software as a Service)**, która umożliwia użytkownikowi wygenerowanie profesjonalnych ogłoszeń na podstawie słów kluczowych.  
Projekt stworzony z myślą o prostocie obsługi, płatnościach online oraz rozwoju pod kątem SEO i monetyzacji.

---

## 🎯 Główne funkcje

- 🔐 Rejestracja i logowanie użytkownika (JWT, httpOnly cookie)
- 🧠 Generowanie ogłoszeń przy użyciu OpenAI (ChatGPT)
- 💳 Płatności Stripe (odblokowanie pakietu)
- 📜 Historia wygenerowanych ogłoszeń
- 🌐 Aplikacja dwujęzyczna (PL/EN)
- 📱 W pełni responsywny UI
- 🧪 Zintegrowane testy (unit + e2e)

---

## 🧰 Stack technologiczny

- **Frontend / Fullstack:** Next.js 14 (App Router)
- **Backend:** API Routes w Next.js + MongoDB
- **Baza danych:** MongoDB Atlas
- **UI:** CSS Modules + własne komponenty
- **Autoryzacja:** JWT (httpOnly cookie)
- **AI:** OpenAI API
- **Płatności:** Stripe Checkout
- **Stan aplikacji:** SWR + useContext
- **Testy:** Jest + React Testing Library + Playwright

---

## 🚀 Uruchomienie lokalnie

1. Sklonuj repozytorium:

   ```bash
   git clone https://github.com/twoj-login/generator-ogloszen.git
   cd generator-ogloszen
   ```

2. Zainstaluj zależności:

   ```bash
   npm install
   ```

3. Utwórz plik `.env.local` i uzupełnij:

   ```env
   MONGO_URI=...
   JWT_SECRET=...
   OPENAI_API_KEY=...
   OPENAI_MODEL=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   STRIPE_SECRET_KEY=...
   NEXT_PUBLIC_BASE_URL=...
   ```

4. Uruchom projekt:

   ```bash
   npm run dev
   ```

5. Aplikacja będzie działać pod `http://localhost:3000`

---

## 🧪 Testy

### Testy jednostkowe i integracyjne (Jest)

```bash
npm run test
npm run test:watch
npm run test:coverage
```

### Testy e2e (Playwright)

```bash
npx playwright test
npx playwright show-report
```

---

## 📸 Zrzuty ekranu

_(dodaj tu linki lub obrazy prezentujące UI)_

---

## 📌 Planowane funkcje

- [ ] Generowanie ogłoszeń branżowych (filtrowanie wg kategorii)
- [ ] System subskrypcji (pakiety miesięczne)
- [ ] Panel administratora (zarządzanie użytkownikami i danymi)
- [ ] Webhooki Stripe + historia płatności

---

## 📁 Struktura projektu (skrótowo)

```
src/
├── app/               # Strony i routing
├── api/               # API Routes
├── components/        # UI komponenty
├── context/           # useContext (np. Auth, Cart)
├── lib/               # Pomocnicze funkcje (np. stripe, auth)
├── models/            # Schematy MongoDB
├── data/              # Słowniki i dane stałe
└── __tests__/         # Testy (unit / integration / e2e)
```

---

## 👨‍💻 Autor

Projekt stworzony przez Jacek Pasierb, jako portfolio oraz baza pod realną aplikację SaaS.  
Pomysł, kod, UI i backend wykonane samodzielnie z naciskiem na jakość, skalowalność i automatyzację.

---

## 📓 Notatki przydatne

### Github Actions

- Tworzenie nowego brancha:  
  git branch (nazwa branch)
- Tworzenie nowego brancha i przełączenie na niego:  
  git checkout -b nazwa-gałęzi
- Sprawdzanie listy branchy:  
  git branch
- Zmiana branch:  
  git switch (nazwa branch) / git checkout (nazwa branch)
- Pierwszy push na nowej gałęzi wymaga powiązania ze zdalną:  
  git push --set-upstream origin nazwa-gałęzi  
  lub git push -u origin nazwa-gałęzi
- Usuwanie branch lokalnie:  
  git branch -d feature/nazwa-twojego-brancha
- Usuwanie zdalnie z GitHub :  
  git push origin --delete feature/nazwa-twojego-brancha
- Pobieranie aktualnego main:  
   git pull origin main  
   ( pobiera i od razu scala najnowszy main z GitHuba do mojego lokalnego main.)

  git fetch origin  
  (pobiera najnowsze zmiany z GitHuba bez ingerencji w mój kod.)

### Playwright

- npx playwright codegen https://generator-ogloszen.com
  (uruchamianie nagrywania testu)
- npx playwright show-report  
  (podgląd raportu testów)
-
