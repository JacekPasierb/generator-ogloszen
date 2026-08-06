import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../ui/SiteNav/SiteNav";
import styles from "./PolitykaPrywatnosci.module.css";

export const metadata: Metadata = {
  title: "Polityka prywatności | Generator Ogłoszeń",
  description:
    "Jak przetwarzamy dane w Generatorze Ogłoszeń — konto, cookies, płatności Stripe i Twoje prawa RODO.",
};

const TOC = [
  { id: "administrator", label: "Administrator danych" },
  { id: "zakres", label: "Zakres danych" },
  { id: "cel", label: "Cel przetwarzania" },
  { id: "podstawy", label: "Podstawy prawne" },
  { id: "odbiorcy", label: "Odbiorcy danych" },
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
                <p>Przetwarzamy tylko niezbędne dane:</p>
                <ul>
                  <li>
                    adres e-mail i zaszyfrowane hasło — w celu założenia konta,
                  </li>
                  <li>
                    dane do logowania (token) — przechowywane tymczasowo w
                    bezpiecznym cookie,
                  </li>
                  <li>
                    wygenerowane opisy — zapisywane tylko jeśli użytkownik je
                    zatwierdzi.
                  </li>
                </ul>
              </section>

              <section id="cel" className={styles.section}>
                <h2>3. Cel przetwarzania danych</h2>
                <ul>
                  <li>autoryzacja użytkownika i dostęp do funkcji konta,</li>
                  <li>generowanie i zapisywanie treści ogłoszeń,</li>
                  <li>obsługa płatności poprzez Stripe.</li>
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
                    obowiązków prawnych, np. księgowość (art. 6 ust. 1 lit. c
                    RODO).
                  </li>
                </ul>
              </section>

              <section id="odbiorcy" className={styles.section}>
                <h2>5. Odbiorcy danych</h2>
                <p>
                  Dane mogą być przekazywane firmie Stripe w celu obsługi
                  płatności. Dane nie są przekazywane do innych podmiotów bez
                  zgody użytkownika.
                </p>
              </section>

              <section id="okres" className={styles.section}>
                <h2>6. Okres przechowywania danych</h2>
                <ul>
                  <li>
                    dane konta — do czasu usunięcia konta przez użytkownika,
                  </li>
                  <li>
                    dane zapisanych ogłoszeń — do momentu ich ręcznego usunięcia
                    lub usunięcia konta,
                  </li>
                  <li>
                    dane związane z płatnościami — zgodnie z obowiązującymi
                    przepisami księgowymi.
                  </li>
                </ul>
              </section>

              <section id="cookies" className={styles.section}>
                <h2>7. Pliki cookies</h2>
                <p>
                  Korzystamy z technicznych plików cookies w celu
                  uwierzytelniania użytkownika. Przechowujemy w nich token
                  dostępu w formie bezpiecznego{" "}
                  <code>httpOnly cookie</code>, niedostępnego dla JavaScript.
                  Nie wykorzystujemy cookies do śledzenia użytkowników ani do
                  celów marketingowych.
                </p>
              </section>

              <section id="prawa" className={styles.section}>
                <h2>8. Prawa użytkownika</h2>
                <ul>
                  <li>dostęp do danych,</li>
                  <li>poprawianie danych,</li>
                  <li>usunięcie konta,</li>
                  <li>ograniczenie przetwarzania,</li>
                  <li>
                    prawo do wniesienia skargi do Prezesa UODO.
                  </li>
                </ul>
              </section>

              <section id="platnosci" className={styles.section}>
                <h2>9. Płatności</h2>
                <p>
                  Płatności realizowane są za pomocą zewnętrznej platformy
                  Stripe, Inc. Dane płatnicze (np. numer karty) trafiają
                  bezpośrednio do Stripe i nie są przechowywane przez nasz
                  serwis. Stripe spełnia standardy bezpieczeństwa PCI DSS.
                </p>
              </section>

              <section id="kontakt" className={styles.section}>
                <h2>10. Kontakt</h2>
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
