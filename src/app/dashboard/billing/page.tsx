"use client";

import React, { useEffect, useState } from "react";
import Header from "../../ui/Header/Header";
import Loading from "../../components/Loading/Loading";
import { useUser } from "../../hooks/useUser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { plans } from "../../data/plans";
import CardProduct from "../../components/CardProduct/CardProduct";
import styles from "./billing.module.css";

interface EventRow {
  event: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}

const EVENT_LABELS: Record<string, string> = {
  signup: "Rejestracja",
  generate: "Wygenerowano opis",
  checkout_start: "Start płatności",
  purchase: "Zakup pakietu",
  paywall_view: "Widok oferty pakietów",
};

function formatEventTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BillingPage() {
  const {
    user,
    plan,
    isPaid,
    aiLimit,
    aiUsed,
    aiLeft,
    trialCredits,
    totalCredits,
  } = useUser();
  const router = useRouter();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/events?limit=20", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.events) setEvents(data.events);
      })
      .catch(() => {})
      .finally(() => setLoadingEvents(false));
  }, [user]);

  if (user === undefined) return <Loading label="Sprawdzam sesję…" />;
  if (user === null) return <Loading label="Przekierowuję…" />;

  const currentPlan = plans.find((p) => p.id === plan);
  const planName =
    currentPlan?.name ??
    (plan === "free"
      ? trialCredits > 0
        ? "Trial"
        : "Darmowy"
      : plan);

  const progressPct =
    aiLimit > 0
      ? Math.max(0, Math.min(100, (aiLeft / aiLimit) * 100))
      : 0;

  const isExhausted = isPaid && aiLeft <= 0;
  const showPackages = !isPaid || isExhausted;

  return (
    <>
      <Header />
      <main className={`section container ${styles.page}`}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Konto</p>
          <h1 className={styles.title}>Plan, kredyty i aktywność</h1>
          <p className={styles.subTitle}>
            Zarządzaj pakietem opisów AI — jednorazowa płatność, bez subskrypcji.
          </p>
        </div>

        <div className={styles.layout}>
          <section
            className={`${styles.panel} ${styles.planPanel}`}
            data-tone={
              isPaid ? (isExhausted ? "empty" : "paid") : trialCredits > 0 ? "trial" : "free"
            }
          >
            <div className={styles.panelTop}>
              <span className={styles.panelLabel}>Aktualny plan</span>
              <span className={styles.planBadge}>{planName}</span>
            </div>

            <p className={styles.email}>{user.email}</p>

            {isPaid ? (
              <div className={styles.usageBlock}>
                <div className={styles.usageRow}>
                  <span className={styles.usageLabel}>Pozostałe opisy</span>
                  <span className={styles.usageValue}>
                    {aiLeft}
                    <span className={styles.usageTotal}> / {aiLimit}</span>
                  </span>
                </div>
                <div className={styles.bar} aria-hidden>
                  <div
                    className={`${styles.barFill} ${
                      aiLeft === 0 ? styles.barEmpty : ""
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className={styles.usageHint}>
                  Wykorzystane {aiUsed} z {aiLimit}
                  {isExhausted ? " — pakiet wyczerpany" : ""}
                </p>
              </div>
            ) : (
              <div className={styles.usageBlock}>
                <div className={styles.statGrid}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{trialCredits}</span>
                    <span className={styles.statLabel}>Trial</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{totalCredits}</span>
                    <span className={styles.statLabel}>Razem</span>
                  </div>
                </div>
                <p className={styles.usageHint}>
                  {trialCredits > 0
                    ? "Po wykorzystaniu kredytów testowych wybierz pakiet Start, Standard lub Pro."
                    : "Brak kredytów — wybierz pakiet, aby generować opisy."}
                </p>
              </div>
            )}

            <div className={styles.planActions}>
              <Link href="/dashboard" className={styles.btnGhost}>
                Wróć do generatora
              </Link>
              {showPackages && (
                <a href="#pakiety" className={styles.btnPrimary}>
                  {isExhausted ? "Kup kolejny pakiet" : "Wybierz pakiet"}
                </a>
              )}
            </div>
          </section>

          <section className={`${styles.panel} ${styles.activityPanel}`}>
            <div className={styles.panelTop}>
              <span className={styles.panelLabel}>Ostatnia aktywność</span>
              {!loadingEvents && events.length > 0 && (
                <span className={styles.countPill}>{events.length}</span>
              )}
            </div>

            {loadingEvents ? (
              <p className={styles.muted}>Ładowanie aktywności…</p>
            ) : events.length === 0 ? (
              <div className={styles.emptyActivity}>
                <span className={styles.emptyMark} aria-hidden />
                <p className={styles.emptyTitle}>Brak zdarzeń</p>
                <p className={styles.muted}>
                  Generowanie opisów i zakupy pojawią się tutaj.
                </p>
              </div>
            ) : (
              <ul className={styles.timeline}>
                {events.map((e, i) => (
                  <li key={`${e.event}-${e.createdAt}-${i}`} className={styles.timelineItem}>
                    <span className={styles.timelineDot} aria-hidden />
                    <div className={styles.timelineBody}>
                      <span className={styles.eventType}>
                        {EVENT_LABELS[e.event] ?? e.event}
                      </span>
                      <span className={styles.eventTime}>
                        {formatEventTime(e.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {showPackages && (
          <section className={styles.packages} id="pakiety">
            <div className={styles.packagesHead}>
              <p className={styles.eyebrow}>Pakiety</p>
              <h2 className={styles.packagesTitle}>
                Płać za opisy. Nie za subskrypcję.
              </h2>
              <p className={styles.subTitle}>
                Jednorazowy zakup kredytów — generuj, kopiuj, publikuj.
              </p>
            </div>
            <CardProduct mode="dashboard" />
          </section>
        )}
      </main>
    </>
  );
}
