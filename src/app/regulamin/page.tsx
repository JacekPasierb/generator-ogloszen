import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../ui/SiteNav/SiteNav";
import styles from "./Regulamin.module.css";

export const metadata: Metadata = {
  title: "Regulamin | Generator Ogłoszeń",
  description:
    "Regulamin serwisu Generator Ogłoszeń — generowanie opisów ze słów kluczowych lub zdjęcia, pakiety, Stripe i zasady korzystania z AI.",
};

const TOC = [
  { id: "ogolne", label: "Postanowienia ogólne" },
  { id: "definicje", label: "Definicje" },
  { id: "warunki", label: "Warunki korzystania" },
  { id: "generator", label: "Generator AI" },
  { id: "platne", label: "Usługi płatne" },
  { id: "odpowiedzialnosc", label: "Odpowiedzialność" },
  { id: "konto", label: "Usunięcie konta" },
  { id: "dane", label: "Dane osobowe" },
  { id: "reklamacje", label: "Reklamacje" },
  { id: "koncowe", label: "Postanowienia końcowe" },
] as const;

export default function Regulamin() {
  return (
    <div className={styles.page}>
      <SiteNav />

      <main className={styles.main}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Dokument prawny</p>
            <h1 className={styles.title}>Regulamin serwisu</h1>
            <p className={styles.lede}>
              Zasady korzystania z Generatora Ogłoszeń — generowania opisów
              sprzedażowych ze słów kluczowych lub zdjęcia produktu przy użyciu
              AI.
            </p>
            <p className={styles.meta}>
              Obowiązuje od: <strong>26.05.2025 r.</strong>
              {" · "}
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
              <section id="ogolne" className={styles.section}>
                <h2>1. Postanowienia ogólne</h2>
                <p>
                  Niniejszy regulamin określa zasady korzystania z serwisu
                  internetowego dostępnego pod adresem{" "}
                  <strong>generator-ogloszen.com</strong>, który umożliwia
                  generowanie opisów ogłoszeń przy użyciu technologii sztucznej
                  inteligencji (AI) — na podstawie słów kluczowych i/lub zdjęcia
                  produktu.
                </p>
                <p>
                  Korzystając z serwisu, Użytkownik oświadcza, że zapoznał się z
                  treścią regulaminu, akceptuje jego postanowienia i zobowiązuje
                  się do ich przestrzegania.
                </p>
              </section>

              <section id="definicje" className={styles.section}>
                <h2>2. Definicje</h2>
                <ul>
                  <li>
                    <strong>Serwis</strong> – strona internetowa dostępna pod
                    adresem <strong>generator-ogloszen.com</strong>.
                  </li>
                  <li>
                    <strong>Użytkownik</strong> – osoba fizyczna korzystająca z
                    Serwisu, która założyła konto i zalogowała się w Serwisie.
                  </li>
                  <li>
                    <strong>Administrator</strong> – właściciel Serwisu, osoba
                    fizyczna prowadząca działalność nierejestrowaną.
                  </li>
                  <li>
                    <strong>Generator</strong> – funkcja Serwisu służąca do
                    tworzenia treści ogłoszeń (w tym tytułu, wersji krótkiej i
                    długiej) przy użyciu AI.
                  </li>
                  <li>
                    <strong>Dane wejściowe</strong> – treści przekazane przez
                    Użytkownika do Generatora: słowa kluczowe / opis faktów
                    oraz opcjonalnie zdjęcie produktu.
                  </li>
                  <li>
                    <strong>Pakiet</strong> – jednorazowo płatna usługa
                    umożliwiająca generowanie opisów ogłoszeń przy użyciu AI w
                    ramach limitu zapytań (kredytów).
                  </li>
                  <li>
                    <strong>Plany / Pakiety</strong> – warianty Pakietu dostępne
                    w Serwisie: <strong>START</strong>,{" "}
                    <strong>STANDARD</strong>, <strong>PRO</strong>, różniące się
                    ceną oraz limitem zapytań.
                  </li>
                  <li>
                    <strong>Limit zapytań</strong> – maksymalna liczba opisów,
                    które Użytkownik może wygenerować w ramach wykupionego
                    Pakietu lub kredytów testowych.
                  </li>
                </ul>
              </section>

              <section id="warunki" className={styles.section}>
                <h2>3. Warunki korzystania z Serwisu</h2>
                <ul>
                  <li>
                    Korzystanie z podstawowych funkcji Serwisu wymaga założenia
                    konta oraz zalogowania się przez Użytkownika.
                  </li>
                  <li>
                    Użytkownik zobowiązuje się do podania prawdziwego adresu
                    e-mail oraz ustawienia bezpiecznego hasła, a także do
                    zachowania danych logowania w poufności.
                  </li>
                  <li>
                    Zabrania się wykorzystywania Serwisu w sposób sprzeczny z
                    prawem, dobrymi obyczajami lub z naruszeniem dóbr osobistych
                    osób trzecich.
                  </li>
                  <li>
                    Administrator ma prawo zablokować lub usunąć konto
                    Użytkownika, który narusza postanowienia niniejszego
                    regulaminu lub podejmuje działania zagrażające
                    bezpieczeństwu Serwisu.
                  </li>
                </ul>
              </section>

              <section id="generator" className={styles.section}>
                <h2>4. Generator AI — tekst i zdjęcia</h2>
                <ul>
                  <li>
                    Generator umożliwia tworzenie opisów ogłoszeń na podstawie:{" "}
                    <strong>słów kluczowych / informacji tekstowych</strong>{" "}
                    oraz opcjonalnie <strong>zdjęcia produktu</strong>.
                  </li>
                  <li>
                    Jedna generacja (również ze zdjęciem lub w trybie pełnego
                    pakietu treści: tytuł + wersja krótka + opis) zużywa limity
                    zapytań zgodnie z informacją prezentowaną w Serwisie
                    (zazwyczaj 1 kredyt = 1 generacja).
                  </li>
                  <li>
                    Dane wejściowe są przekazywane do zewnętrznego dostawcy
                    modelu AI (OpenAI) wyłącznie w celu wygenerowania treści.
                    Szczegóły przetwarzania danych opisuje{" "}
                    <Link href="/polityka-prywatnosci">
                      Polityka prywatności
                    </Link>
                    .
                  </li>
                  <li>
                    Zdjęcia przesłane do Generatora służą wyłącznie do
                    wygenerowania opisu; Serwis nie prowadzi trwałej galerii
                    zdjęć Użytkownika.
                  </li>
                  <li>
                    Użytkownik oświadcza, że posiada prawo do przesłanych treści
                    i zdjęć (w tym prawo do ich wykorzystania w celu
                    wygenerowania opisu) oraz że nie naruszają one prawa osób
                    trzecich, w szczególności praw autorskich i wizerunku.
                  </li>
                  <li>
                    Zabrania się przesyłania treści i zdjęć nielegalnych,
                    obraźliwych, zawierających dane wrażliwe bez podstawy prawnej
                    lub służących do wprowadzania w błąd nabywców.
                  </li>
                  <li>
                    Użytkownik powinien przed publikacją ogłoszenia samodzielnie
                    zweryfikować wygenerowaną treść (fakty, cenę, stan, cechy
                    produktu).
                  </li>
                </ul>
              </section>

              <section id="platne" className={styles.section}>
                <h2>5. Usługi płatne</h2>
                <ul>
                  <li>
                    Użytkownik może wykupić Pakiet w jednym z planów:{" "}
                    <strong>START</strong>, <strong>STANDARD</strong>,{" "}
                    <strong>PRO</strong>. Każdy plan zawiera określony{" "}
                    <strong>Limit zapytań</strong>.
                  </li>
                  <li>
                    Aktualna cena, limity oraz zakres planów są prezentowane w
                    Serwisie w momencie zakupu i mogą ulegać zmianom w czasie.
                    Zmiana oferty nie wpływa na Pakiety już zakupione.
                  </li>
                  <li>
                    Płatności realizowane są za pośrednictwem zewnętrznego
                    operatora płatności <strong>Stripe</strong>, zgodnie z jego
                    regulaminem i standardami bezpieczeństwa.
                  </li>
                  <li>
                    Zakup Pakietu ma charakter <strong>jednorazowy</strong>{" "}
                    (brak subskrypcji), o ile Serwis nie wskazuje inaczej.
                  </li>
                  <li>
                    Po skutecznym dokonaniu płatności Użytkownik uzyskuje dostęp
                    do generowania opisów w ramach limitu zapytań.
                  </li>
                  <li>
                    Po wyczerpaniu limitu zapytań w danym Pakiecie Użytkownik
                    traci możliwość dalszego generowania opisów w ramach tego
                    Pakietu, do czasu wykupienia kolejnego Pakietu.
                  </li>
                  <li>
                    Zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta,
                    po zakupie Pakietu Użytkownik traci prawo do odstąpienia od
                    umowy, jeżeli wyraził zgodę na rozpoczęcie świadczenia
                    usługi przed upływem terminu do odstąpienia oraz został
                    poinformowany o utracie tego prawa.
                  </li>
                </ul>
              </section>

              <section id="odpowiedzialnosc" className={styles.section}>
                <h2>6. Odpowiedzialność</h2>
                <ul>
                  <li>
                    Administrator dokłada starań, aby Serwis działał poprawnie i
                    był dostępny dla Użytkowników, jednak nie gwarantuje pełnej
                    dostępności Serwisu w każdym czasie.
                  </li>
                  <li>
                    Administrator nie ponosi odpowiedzialności za treści
                    generowane przez Użytkownika ani za sposób wykorzystania
                    wygenerowanych opisów w serwisach zewnętrznych (np. OLX,
                    Vinted, Marketplace).
                  </li>
                  <li>
                    Administrator nie gwarantuje, że wygenerowane opisy będą
                    wolne od błędów, kompletne lub w pełni zgodne z rzeczywistymi
                    cechami produktu widocznymi na zdjęciu; Użytkownik powinien
                    zweryfikować treść przed publikacją.
                  </li>
                  <li>
                    Administrator nie ponosi odpowiedzialności za przerwy w
                    działaniu Serwisu wynikające z konieczności przeprowadzenia
                    prac technicznych, awarii, niedostępności zewnętrznych API
                    AI lub przyczyn niezależnych od Administratora.
                  </li>
                  <li>
                    Użytkownik korzysta z Serwisu na własną odpowiedzialność.
                  </li>
                </ul>
              </section>

              <section id="konto" className={styles.section}>
                <h2>7. Usunięcie konta</h2>
                <ul>
                  <li>
                    Użytkownik może w każdej chwili zażądać usunięcia konta,
                    kontaktując się z Administratorem na adres e-mail:{" "}
                    <a href="mailto:kontakt@generator-ogloszen.com">
                      kontakt@generator-ogloszen.com
                    </a>
                    .
                  </li>
                  <li>
                    Usunięcie konta powoduje usunięcie danych konta oraz
                    zapisanych opisów, z wyjątkiem danych, które Administrator
                    zobowiązany jest przechowywać na podstawie przepisów prawa
                    (np. dane księgowe związane z płatnościami).
                  </li>
                </ul>
              </section>

              <section id="dane" className={styles.section}>
                <h2>8. Dane osobowe</h2>
                <p>
                  Zasady przetwarzania danych osobowych Użytkowników, w tym
                  informacje o administratorze danych, celach, podstawach
                  prawnych, odbiorcach (w tym OpenAI i Stripe) oraz uprawnieniach
                  Użytkownika, zostały opisane w dokumencie{" "}
                  <Link href="/polityka-prywatnosci">
                    Polityka prywatności
                  </Link>
                  , dostępnym w Serwisie.
                </p>
                <p>
                  Korzystanie z Serwisu oznacza akceptację zasad przetwarzania
                  danych osobowych określonych w Polityce prywatności.
                </p>
              </section>

              <section id="reklamacje" className={styles.section}>
                <h2>9. Reklamacje</h2>
                <ul>
                  <li>
                    Użytkownik może zgłaszać reklamacje dotyczące działania
                    Serwisu lub zakupionych usług na adres e-mail:{" "}
                    <a href="mailto:kontakt@generator-ogloszen.com">
                      kontakt@generator-ogloszen.com
                    </a>
                    .
                  </li>
                  <li>
                    W treści reklamacji zaleca się podanie: adresu e-mail
                    przypisanego do konta, opisu problemu oraz daty jego
                    wystąpienia.
                  </li>
                  <li>
                    Administrator udzieli odpowiedzi na reklamację w możliwie
                    najkrótszym terminie, nie dłuższym niż 30 dni od dnia jej
                    otrzymania.
                  </li>
                </ul>
              </section>

              <section id="koncowe" className={styles.section}>
                <h2>10. Postanowienia końcowe</h2>
                <ul>
                  <li>
                    Administrator zastrzega sobie prawo do zmiany niniejszego
                    regulaminu. Zmiany będą publikowane w Serwisie i obowiązują
                    od dnia ich opublikowania.
                  </li>
                  <li>
                    O istotnych zmianach regulaminu Użytkownik może zostać
                    dodatkowo poinformowany poprzez komunikat w Serwisie lub
                    wiadomość e-mail.
                  </li>
                  <li>
                    W sprawach nieuregulowanych niniejszym regulaminem
                    zastosowanie mają przepisy prawa polskiego.
                  </li>
                  <li>
                    Kontakt z Administratorem jest możliwy pod adresem e-mail:{" "}
                    <a href="mailto:kontakt@generator-ogloszen.com">
                      kontakt@generator-ogloszen.com
                    </a>
                    .
                  </li>
                </ul>
              </section>

              <div className={styles.footerNav}>
                <Link href="/polityka-prywatnosci" className={styles.back}>
                  ← Polityka prywatności
                </Link>
                <Link href="/" className={styles.next}>
                  Strona główna →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}
