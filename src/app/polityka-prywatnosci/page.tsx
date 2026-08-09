import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../ui/SiteNav/SiteNav";
import styles from "./PolitykaPrywatnosci.module.css";

export const metadata: Metadata = {
  title: "Polityka prywatności | Generator Ogłoszeń",
  description:
    "Jak przetwarzamy dane w Generatorze Ogłoszeń — konto, generowanie AI (tekst i zdjęcia), OpenAI, Stripe, cookies i Twoje prawa RODO.",
};

const TOC = [
  { id: "administrator", label: "Administrator danych" },
  { id: "zakres", label: "Zakres danych" },
  { id: "cel", label: "Cel przetwarzania" },
  { id: "podstawy", label: "Podstawy prawne" },
  { id: "odbiorcy", label: "Odbiorcy danych" },
  { id: "ai", label: "Generowanie AI" },
  { id: "okres", label: "Okres przechowywania" },
  { id: "cookies", label: "Pliki cookies" },
  { id: "prawa", label: "Prawa użytkownika" },
  { id: "platnosci", label: "Płatności" },
  { id: "kontakt", label: "Kontakt" },
] as const;

export default function PolitykaPrywatnosci() {
  return (
    <div className={styles.page}>
      <SiteNav />

      <main className={styles.main}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Dokument prawny</p>
            <h1 className={styles.title}>Polityka prywatności</h1>
            <p className={styles.lede}>
              Dbamy o Twoją prywatność. Poniżej znajdziesz jasne informacje, jakie
              dane przetwarzamy w Generatorze Ogłoszeń i w jakim celu.
            </p>
            <p className={styles.meta}>
              Ostatnia aktualizacja: <strong>9.08.2026 r.</strong>
              {" · "}
              Serwis: <strong>generator-ogloszen.com</strong>
            </p>
          </header>

          <div className={styles.layout}>
            <aside className={styles.toc} aria-label="Spis treści">
              <p className={styles.tocTitle}>Na tej stronie</p>
              <nav className={styles.tocNav}>
                {TOC.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className={styles.tocLink}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </aside>

            <article className={styles.prose}>
              <section id="administrator" className={styles.section}>
                <h2>1. Administrator danych</h2>
                <p>
                  Administratorem danych jest właściciel serwisu dostępnego pod
                  adresem <strong>generator-ogloszen.com</strong>.
                </p>
              </section>

              <section id="zakres" className={styles.section}>
                <h2>2. Zakres zbieranych danych</h2>
                <p>Przetwarzamy dane niezbędne do działania Serwisu:</p>
                <ul>
                  <li>
                    adres e-mail i zaszyfrowane hasło — w celu założenia konta,
                  </li>
                  <li>
                    dane do logowania (token) — przechowywane tymczasowo w
                    bezpiecznym cookie,
                  </li>
                  <li>
                    treści wprowadzone przez Użytkownika do generatora (np. słowa
                    kluczowe, dodatkowe informacje o ofercie),
                  </li>
                  <li>
                    zdjęcia produktów przesłane do generatora w celu utworzenia
                    opisu (przetwarzane przejściowo — nie są trwale
                    przechowywane w Serwisie jako biblioteka zdjęć),
                  </li>
                  <li>
                    wygenerowane opisy (oraz opcjonalnie tytuł i wersja krótka)
                    — zapisywane tylko jeśli Użytkownik je zatwierdzi / zapisze,
                  </li>
                  <li>
                    dane techniczne i analityczne związane z korzystaniem z
                    Serwisu (np. zdarzenia w ramach Google Analytics — w zakresie
                    wynikającym z konfiguracji narzędzi),
                  </li>
                  <li>
                    dane związane z płatnościami i statusem pakietu (plan,
                    limity generacji) — bez przechowywania numerów kart przez
                    Serwis.
                  </li>
                </ul>
              </section>

              <section id="cel" className={styles.section}>
                <h2>3. Cel przetwarzania danych</h2>
                <ul>
                  <li>autoryzacja użytkownika i dostęp do funkcji konta,</li>
                  <li>
                    generowanie treści ogłoszeń przy użyciu AI (na podstawie
                    tekstu i/lub zdjęcia),
                  </li>
                  <li>zapisywanie i zarządzanie zapisanymi opisami,</li>
                  <li>obsługa płatności i aktywacja pakietów kredytów,</li>
                  <li>
                    poprawa działania Serwisu, bezpieczeństwo oraz podstawowa
                    analityka ruchu.
                  </li>
                </ul>
              </section>

              <section id="podstawy" className={styles.section}>
                <h2>4. Podstawy prawne przetwarzania</h2>
                <p>Przetwarzanie danych odbywa się na podstawie:</p>
                <ul>
                  <li>zgody użytkownika (art. 6 ust. 1 lit. a RODO),</li>
                  <li>
                    realizacji umowy — świadczenia usług (art. 6 ust. 1 lit. b
                    RODO),
                  </li>
                  <li>
                    prawnie uzasadnionego interesu Administratora, m.in.
                    bezpieczeństwo i analityka działania Serwisu (art. 6 ust. 1
                    lit. f RODO),
                  </li>
                  <li>
                    obowiązków prawnych, np. księgowość (art. 6 ust. 1 lit. c
                    RODO).
                  </li>
                </ul>
              </section>

              <section id="odbiorcy" className={styles.section}>
                <h2>5. Odbiorcy danych</h2>
                <p>
                  Dane mogą być przekazywane zaufanym podmiotom przetwarzającym
                  je w naszym imieniu lub niezależnie w zakresie niezbędnym do
                  świadczenia usług:
                </p>
                <ul>
                  <li>
                    <strong>OpenAI, L.L.C.</strong> (lub powiązane podmioty
                    świadczące API) — w celu wygenerowania treści ogłoszenia.
                    Przekazywane mogą być m.in. wprowadzony tekst (słowa
                    kluczowe / dodatkowe informacje) oraz — gdy Użytkownik
                    skorzysta z tej funkcji — przesłane zdjęcie produktu.
                    Przetwarzanie odbywa się zgodnie z warunkami i polityką
                    prywatności dostawcy API AI,
                  </li>
                  <li>
                    <strong>Stripe, Inc.</strong> — w celu obsługi płatności,
                  </li>
                  <li>
                    dostawcy hostingu / infrastruktury technicznej Serwisu,
                  </li>
                  <li>
                    <strong>Google</strong> (Google Analytics) — w zakresie
                    analityki ruchu, jeśli skrypt jest aktywny w Serwisie.
                  </li>
                </ul>
                <p>
                  Dane nie są sprzedawane ani udostępniane innym podmiotom w
                  celach marketingowych podmiotów trzecich. Przekazanie danych
                  poza Europejski Obszar Gospodarczy (EOG) może następować w
                  związku z korzystaniem z usług ww. dostawców mających siedzibę
                  lub infrastrukturę poza EOG — na zasadach przewidzianych przez
                  RODO (m.in. standardowe klauzule umowne lub inne mechanizmy
                  stosowane przez dostawcę).
                </p>
              </section>

              <section id="ai" className={styles.section}>
                <h2>6. Generowanie treści przy użyciu AI</h2>
                <ul>
                  <li>
                    Aby wygenerować opis, Serwis przesyła do dostawcy modelu AI
                    (OpenAI) dane wejściowe Użytkownika: tekst i/lub obraz.
                  </li>
                  <li>
                    Zdjęcia produktów służą wyłącznie do wygenerowania opisu;
                    nie prowadzimy trwałej galerii przesłanych zdjęć w Serwisie.
                    Po przetworzeniu żądania obraz nie jest przechowywany jako
                    osobny zasób użytkownika.
                  </li>
                  <li>
                    Zapisane w koncie mogą być wyłącznie wygenerowane treści
                    tekstowe (opis / tytuł / wersja krótka), jeśli Użytkownik je
                    zapisze — w ramach limitu biblioteki.
                  </li>
                  <li>
                    Użytkownik powinien unikać przesyłania w generatorze danych
                    wrażliwych oraz treści, do których nie ma prawa (w tym zdjęć
                    osób trzecich bez podstawy do ich użycia).
                  </li>
                </ul>
              </section>

              <section id="okres" className={styles.section}>
                <h2>7. Okres przechowywania danych</h2>
                <ul>
                  <li>
                    dane konta — do czasu usunięcia konta przez użytkownika,
                  </li>
                  <li>
                    dane zapisanych ogłoszeń — do momentu ich ręcznego usunięcia
                    lub usunięcia konta,
                  </li>
                  <li>
                    dane wejściowe do generowania (tekst / obraz w żądaniu) —
                    przetwarzane w zakresie niezbędnym do realizacji generacji;
                    zdjęcia nie są trwale archiwizowane w Serwisie,
                  </li>
                  <li>
                    dane związane z płatnościami — zgodnie z obowiązującymi
                    przepisami księgowymi,
                  </li>
                  <li>
                    dane analityczne — zgodnie z ustawieniami narzędzia
                    analitycznego i okresem retencji u dostawcy.
                  </li>
                </ul>
              </section>

              <section id="cookies" className={styles.section}>
                <h2>8. Pliki cookies</h2>
                <p>
                  Korzystamy z technicznych plików cookies w celu
                  uwierzytelniania użytkownika. Przechowujemy w nich token
                  dostępu w formie bezpiecznego{" "}
                  <code>httpOnly cookie</code>, niedostępnego dla JavaScript.
                </p>
                <p>
                  W Serwisie może być używany skrypt Google Analytics, który
                  wykorzystuje własne mechanizmy pomiaru (w tym cookies /
                  identyfikatory po stronie przeglądarki) w celu statystyk
                  odwiedzin. Szczegóły przetwarzania danych przez Google
                  opisuje polityka prywatności Google.
                </p>
              </section>

              <section id="prawa" className={styles.section}>
                <h2>9. Prawa użytkownika</h2>
                <ul>
                  <li>dostęp do danych,</li>
                  <li>poprawianie danych,</li>
                  <li>usunięcie konta,</li>
                  <li>ograniczenie przetwarzania,</li>
                  <li>
                    w przypadkach przewidzianych prawem — wniesienie sprzeciwu
                    lub cofnięcie zgody,
                  </li>
                  <li>
                    prawo do wniesienia skargi do Prezesa UODO.
                  </li>
                </ul>
              </section>

              <section id="platnosci" className={styles.section}>
                <h2>10. Płatności</h2>
                <p>
                  Płatności realizowane są za pomocą zewnętrznej platformy
                  Stripe, Inc. Dane płatnicze (np. numer karty) trafiają
                  bezpośrednio do Stripe i nie są przechowywane przez nasz
                  serwis. Stripe spełnia standardy bezpieczeństwa PCI DSS.
                </p>
              </section>

              <section id="kontakt" className={styles.section}>
                <h2>11. Kontakt</h2>
                <p>
                  W sprawach związanych z ochroną danych osobowych możesz
                  napisać na adres e-mail{" "}
                  <a href="mailto:kontakt@generator-ogloszen.com">
                    kontakt@generator-ogloszen.com
                  </a>
                  .
                </p>
              </section>

              <div className={styles.footerNav}>
                <Link href="/" className={styles.back}>
                  ← Wróć na stronę główną
                </Link>
                <Link href="/regulamin" className={styles.next}>
                  Regulamin →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}
