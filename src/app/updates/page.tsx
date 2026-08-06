import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../ui/SiteNav/SiteNav";
import { APP_VERSION } from "@/app/config/version";
import styles from "./Updates.module.css";

export const metadata: Metadata = {
  title: "Co nowego | Generator Ogłoszeń",
  description:
    "Changelog Generatora Ogłoszeń — nowe funkcje, pakiety, płatności Stripe i ulepszenia generatora opisów AI.",
};

type ChangeGroup = {
  title: string;
  items: string[];
};

type Release = {
  version: string;
  date: string;
  current?: boolean;
  summary: string;
  groups: ChangeGroup[];
};

const releases: Release[] = [
  {
    version: "0.2.0",
    date: "14.12.2025",
    current: true,
    summary:
      "Pakiety kredytów, płatności Stripe i nowy dashboard — solidna baza pod monetyzację.",
    groups: [
      {
        title: "Produkt",
        items: [
          "3 pakiety: Start, Standard, Pro — jednorazowa płatność, bez subskrypcji",
          "Limity generacji AI zależne od pakietu",
          "Licznik pozostałych zapytań w koncie",
        ],
      },
      {
        title: "Płatności",
        items: [
          "Integracja Stripe z BLIK (PLN)",
          "Automatyczna aktywacja pakietu przez webhook",
          "Bezpieczne Checkout Sessions",
        ],
      },
      {
        title: "Generator i UX",
        items: [
          "Odświeżony layout formularza i dashboardu",
          "Status konta z nazwą pakietu",
          "Lepsza obsługa po płatności — bez zbędnego odświeżania",
        ],
      },
      {
        title: "Techniczne",
        items: [
          "Centralna definicja planów (data/plans.ts)",
          "Aktualizacja Next.js (security)",
          "Stabilniejszy build i poprawki TypeScript",
        ],
      },
    ],
  },
];

export default function UpdatesPage() {
  return (
    <div className={styles.page}>
      <SiteNav />

      <main className={styles.main}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Changelog</p>
            <h1 className={styles.title}>Co nowego</h1>
            <p className={styles.lede}>
              Aktualizacje Generatora Ogłoszeń — produktu, który zamienia słowa
              kluczowe w gotowe opisy sprzedażowe.
            </p>
            <p className={styles.meta}>
              Aktualna wersja: <strong>v{APP_VERSION}</strong>
            </p>
          </header>

          <div className={styles.timeline}>
            {releases.map((release) => (
              <article key={release.version} className={styles.release}>
                <div className={styles.releaseRail} aria-hidden>
                  <span className={styles.dot} />
                  <span className={styles.line} />
                </div>

                <div className={styles.releaseBody}>
                  <div className={styles.releaseHead}>
                    <div className={styles.versionRow}>
                      <h2 className={styles.version}>v{release.version}</h2>
                      {release.current && (
                        <span className={styles.badge}>Aktualna</span>
                      )}
                    </div>
                    <time className={styles.date} dateTime="2025-12-14">
                      {release.date}
                    </time>
                  </div>

                  <p className={styles.summary}>{release.summary}</p>

                  <div className={styles.groups}>
                    {release.groups.map((group) => (
                      <div key={group.title} className={styles.group}>
                        <h3 className={styles.groupTitle}>{group.title}</h3>
                        <ul className={styles.list}>
                          {group.items.map((item) => (
                            <li key={item} className={styles.item}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.footerNav}>
            <Link href="/" className={styles.back}>
              ← Strona główna
            </Link>
            <Link href="/register" className={styles.cta}>
              Wypróbuj za darmo →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
