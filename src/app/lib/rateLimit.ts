/**
 * Prosty rate limiter w pamięci (dla produkcji rozważyć Redis).
 * Ogranicza liczbę requestów per userId w określonym oknie czasowym.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Konfiguracja: maksymalnie 5 requestów na 60 sekund per użytkownik
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 1000; // 60 sekund

export const checkRateLimit = (userId: string): { allowed: boolean; remaining: number; resetAt: number } => {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry || entry.resetAt < now) {
    // Nowe okno czasowe lub wygasłe
    const resetAt = now + WINDOW_MS;
    rateLimitStore.set(userId, { count: 1, resetAt });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt };
  }

  if (entry.count >= MAX_REQUESTS) {
    // Limit przekroczony
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Zwiększ licznik
  entry.count++;
  rateLimitStore.set(userId, entry);
  return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
};

// Czyszczenie starych wpisów co 5 minut (opcjonalne, zapobiega wyciekom pamięci)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [userId, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(userId);
      }
    }
  }, 5 * 60 * 1000);
}
