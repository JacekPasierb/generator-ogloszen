"use client";

import React, { useEffect, useState } from "react";
import Header from "../../ui/Header/Header";
import Loading from "../../components/Loading/Loading";
import { useUser } from "../../hooks/useUser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { plans } from "../../data/plans";
import styles from "./billing.module.css";

interface EventRow {
  event: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}

export default function BillingPage() {
  const { user, plan, isPaid, aiLimit, aiUsed, aiLeft, trialCredits, totalCredits } = useUser();
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

  if (user === undefined) return <Loading label="Sprawdzam sesję..." />;
  if (user === null) return <Loading label="Przekierowuję..." />;

  const currentPlan = plans.find((p) => p.id === plan);
  const planName = currentPlan?.name ?? (plan === "free" ? "Darmowy" : plan);

  return (
    <>
      <Header />
      <main className={`section container ${styles.main}`}>
        <h1 className={styles.title}>Konto i płatności</h1>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Aktualny plan</h2>
          <p className={styles.planName}>{planName}</p>
          {plan === "free" && (
            <p className={styles.planHint}>
              Masz <strong>{trialCredits}</strong> darmowych kredytów testowych.
              Po ich wykorzystaniu wybierz pakiet.
            </p>
          )}
          {isPaid && (
            <p className={styles.usage}>
              Wykorzystane: <strong>{aiUsed}</strong> / <strong>{aiLimit}</strong> opisów
              (pozostało <strong>{aiLeft}</strong>).
            </p>
          )}
          {!isPaid && (
            <Link href="/dashboard#pricing" className={styles.cta}>
              Wybierz pakiet
            </Link>
          )}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Ostatnia aktywność (eventy)</h2>
          {loadingEvents ? (
            <p className={styles.muted}>Ładowanie…</p>
          ) : events.length === 0 ? (
            <p className={styles.muted}>Brak zdarzeń.</p>
          ) : (
            <ul className={styles.eventList}>
              {events.map((e, i) => (
                <li key={i} className={styles.eventItem}>
                  <span className={styles.eventType}>{e.event}</span>
                  <span className={styles.eventTime}>
                    {new Date(e.createdAt).toLocaleString("pl-PL")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className={styles.back}>
          <Link href="/dashboard">← Powrót do generatora</Link>
        </p>
      </main>
    </>
  );
}
