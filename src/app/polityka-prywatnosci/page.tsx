import styles from './PolitykaPrywatnosci.module.css';

export default function PolitykaPrywatnosci() {
  return (
    <div className={styles.wrapper}>
      <h1>Polityka prywatności</h1>

      <p>Dbamy o Twoją prywatność. Poniżej znajdziesz informacje, jakie dane przetwarzamy i w jakim celu.</p>

      <h2>1. Administrator danych</h2>
      <p>Administratorem danych jest właściciel serwisu dostępnego pod adresem <strong>generator-ogloszen.com</strong>.</p>

      <h2>2. Zakres zbieranych danych</h2>
      <p>Przetwarzamy tylko niezbędne dane:</p>
      <ul>
        <li>adres e-mail i zaszyfrowane hasło — w celu założenia konta,</li>
        <li>dane do logowania (token) — przechowywane tymczasowo w bezpiecznym cookie,</li>
        <li>wygenerowane opisy — zapisywane tylko jeśli użytkownik je zatwierdzi.</li>
      </ul>

      <h2>3. Cel przetwarzania danych</h2>
      <ul>
        <li>autoryzacja użytkownika i dostęp do funkcji konta,</li>
        <li>generowanie i zapisywanie treści ogłoszeń,</li>
        <li>obsługa płatności poprzez Stripe.</li>
      </ul>

      <h2>4. Podstawy prawne przetwarzania</h2>
      <p>Przetwarzanie danych odbywa się na podstawie:</p>
      <ul>
        <li>zgody użytkownika (art. 6 ust. 1 lit. a RODO),</li>
        <li>realizacji umowy — świadczenia usług (art. 6 ust. 1 lit. b RODO),</li>
        <li>obowiązków prawnych, np. księgowość (art. 6 ust. 1 lit. c RODO).</li>
      </ul>

      <h2>5. Odbiorcy danych</h2>
      <p>Dane mogą być przekazywane firmie Stripe w celu obsługi płatności. Dane nie są przekazywane do innych podmiotów bez zgody użytkownika.</p>

      <h2>6. Okres przechowywania danych</h2>
      <ul>
        <li>dane konta — do czasu usunięcia konta przez użytkownika,</li>
        <li>dane zapisanych ogłoszeń — do momentu ich ręcznego usunięcia lub usunięcia konta,</li>
        <li>dane związane z płatnościami — zgodnie z obowiązującymi przepisami księgowymi.</li>
      </ul>

      <h2>7. Pliki cookies</h2>
      <p>
        Korzystamy z technicznych plików cookies w celu uwierzytelniania użytkownika. Przechowujemy w nich token dostępu
        w formie bezpiecznego <code>httpOnly cookie</code>, niedostępnego dla JavaScript. Nie wykorzystujemy cookies do
        śledzenia użytkowników ani do celów marketingowych.
      </p>

      <h2>8. Prawa użytkownika</h2>
      <ul>
        <li>dostęp do danych,</li>
        <li>poprawianie danych,</li>
        <li>usunięcie konta,</li>
        <li>ograniczenie przetwarzania,</li>
        <li>prawo do wniesienia skargi do Prezesa UODO.</li>
      </ul>

      <h2>9. Płatności</h2>
      <p>
        Płatności realizowane są za pomocą zewnętrznej platformy Stripe, Inc. Dane płatnicze (np. numer karty) trafiają
        bezpośrednio do Stripe i nie są przechowywane przez nasz serwis. Stripe spełnia standardy bezpieczeństwa PCI DSS.
      </p>

      <h2>10. Kontakt</h2>
      <p>W sprawach związanych z ochroną danych osobowych możesz napisać na adres e-mail kontakt@generator-ogloszen.com.</p>
    </div>
  );
}
