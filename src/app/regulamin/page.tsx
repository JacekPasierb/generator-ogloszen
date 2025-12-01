import styles from "./Regulamin.module.css";

export default function Regulamin() {
  return (
    <div className={styles.wrapper}>
      <h1>Regulamin serwisu Generator Ogłoszeń</h1>
      <p className={styles.meta}>
        Obowiązuje od: <strong>26.05.2025 r.</strong>
      </p>

      <h2>1. Postanowienia ogólne</h2>
      <p>
        Niniejszy regulamin określa zasady korzystania z serwisu internetowego
        dostępnego pod adresem <strong>generator-ogloszen.com</strong>, który
        umożliwia generowanie opisów ogłoszeń przy użyciu technologii sztucznej
        inteligencji (AI).
      </p>
      <p>
        Korzystając z serwisu, Użytkownik oświadcza, że zapoznał się z treścią
        regulaminu, akceptuje jego postanowienia i zobowiązuje się do ich
        przestrzegania.
      </p>

      <h2>2. Definicje</h2>
      <ul>
        <li>
          <strong>Serwis</strong> – strona internetowa dostępna pod adresem{" "}
          <strong>generator-ogloszen.com</strong>.
        </li>
        <li>
          <strong>Użytkownik</strong> – osoba fizyczna korzystająca z Serwisu,
          która założyła konto lub korzysta z funkcji dostępnych bez
          rejestracji.
        </li>
        <li>
          <strong>Administrator</strong> – właściciel Serwisu, osoba fizyczna
          prowadząca działalność nierejestrowaną.
        </li>
        <li>
          <strong>Pakiet AI</strong> – płatna funkcjonalność Serwisu
          umożliwiająca generowanie określonej liczby opisów ogłoszeń zgodnie z
          aktualną ofertą.
        </li>
      </ul>

      <h2>3. Warunki korzystania z Serwisu</h2>
      <ul>
        <li>
          Korzystanie z podstawowych funkcji Serwisu wymaga założenia konta oraz
          zalogowania się przez Użytkownika.
        </li>
        <li>
          Użytkownik zobowiązuje się do podania prawdziwego adresu e-mail oraz
          ustawienia bezpiecznego hasła, a także do zachowania danych logowania
          w poufności.
        </li>
        <li>
          Zabrania się wykorzystywania Serwisu w sposób sprzeczny z prawem,
          dobrymi obyczajami lub z naruszeniem dóbr osobistych osób trzecich.
        </li>
        <li>
          Administrator ma prawo zablokować lub usunąć konto Użytkownika, który
          narusza postanowienia niniejszego regulaminu lub podejmuje działania
          zagrażające bezpieczeństwu Serwisu.
        </li>
      </ul>

      <h2>4. Usługi płatne</h2>
      <ul>
        <li>
          Użytkownik może wykupić <strong>Pakiet AI</strong>, który umożliwia
          generowanie określonej liczby opisów ogłoszeń zgodnie z informacjami
          podanymi w Serwisie w momencie zakupu.
        </li>
        <li>
          Płatności realizowane są za pośrednictwem zewnętrznego operatora
          płatności <strong>Stripe</strong>, zgodnie z jego regulaminem i
          standardami bezpieczeństwa.
        </li>
        <li>
          Zakup Pakietu AI ma charakter jednorazowy, o ile na stronie nie
          wskazano inaczej (brak domyślnej subskrypcji cyklicznej).
        </li>
        <li>
          Po skutecznym dokonaniu płatności Użytkownik otrzymuje natychmiastowy
          dostęp do usługi.
        </li>
        <li>
          Zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta, po
          zakupie Pakietu AI Użytkownik traci prawo do odstąpienia od umowy,
          ponieważ usługa jest w pełni realizowana z chwilą zakupu.
        </li>
      </ul>

      <h2>5. Odpowiedzialność</h2>
      <ul>
        <li>
          Administrator dokłada starań, aby Serwis działał poprawnie i był
          dostępny dla Użytkowników, jednak nie gwarantuje pełnej dostępności
          Serwisu w każdym czasie.
        </li>
        <li>
          Administrator nie ponosi odpowiedzialności za treści generowane przez
          Użytkownika ani za sposób wykorzystania wygenerowanych opisów w
          serwisach zewnętrznych (np. OLX, Vinted, Marketplace itp.).
        </li>
        <li>
          Administrator nie ponosi odpowiedzialności za przerwy w działaniu
          Serwisu wynikające z konieczności przeprowadzenia prac technicznych,
          awarii lub przyczyn niezależnych od Administratora.
        </li>
        <li>Użytkownik korzysta z Serwisu na własną odpowiedzialność.</li>
      </ul>

      <h2>6. Usunięcie konta</h2>
      <ul>
        <li>
          Użytkownik może w każdej chwili zażądać usunięcia konta, kontaktując
          się z Administratorem na adres e-mail:{" "}
          <a href="mailto:kontakt@generator-ogloszen.com">
            kontakt@generator-ogloszen.com
          </a>
          .
        </li>
        <li>
          Usunięcie konta powoduje usunięcie danych konta oraz zapisanych
          opisów, z wyjątkiem danych, które Administrator zobowiązany jest
          przechowywać na podstawie przepisów prawa (np. dane księgowe związane
          z płatnościami).
        </li>
      </ul>

      <h2>7. Dane osobowe</h2>
      <p>
        Zasady przetwarzania danych osobowych Użytkowników, w tym informacje o
        administratorze danych, celach, podstawach prawnych i uprawnieniach
        Użytkownika, zostały opisane w dokumencie{" "}
        <strong>Polityka prywatności</strong>, dostępnym w Serwisie.
      </p>
      <p>
        Korzystanie z Serwisu oznacza akceptację zasad przetwarzania danych
        osobowych określonych w Polityce prywatności.
      </p>

      <h2>8. Reklamacje</h2>
      <ul>
        <li>
          Użytkownik może zgłaszać reklamacje dotyczące działania Serwisu lub
          zakupionych usług na adres e-mail:{" "}
          <a href="mailto:kontakt@generator-ogloszen.com">
            kontakt@generator-ogloszen.com
          </a>
          .
        </li>
        <li>
          W treści reklamacji zaleca się podanie: adresu e-mail przypisanego do
          konta, opisu problemu oraz daty jego wystąpienia.
        </li>
        <li>
          Administrator udzieli odpowiedzi na reklamację w możliwie najkrótszym
          terminie, nie dłuższym niż 30 dni od dnia jej otrzymania.
        </li>
      </ul>

      <h2>9. Postanowienia końcowe</h2>
      <ul>
        <li>
          Administrator zastrzega sobie prawo do zmiany niniejszego regulaminu.
          Zmiany będą publikowane w Serwisie i obowiązują od dnia ich
          opublikowania.
        </li>
        <li>
          O istotnych zmianach regulaminu Użytkownik może zostać dodatkowo
          poinformowany poprzez komunikat w Serwisie lub wiadomość e-mail.
        </li>
        <li>
          W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają
          przepisy prawa polskiego.
        </li>
        <li>
          Kontakt z Administratorem jest możliwy pod adresem e-mail:{" "}
          <a href="mailto:kontakt@generator-ogloszen.com">
            kontakt@generator-ogloszen.com
          </a>
          .
        </li>
      </ul>
    </div>
  );
}
