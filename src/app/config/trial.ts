/** Promo trial dla nowych kont — do końca sierpnia 2026. */

export const TRIAL_DEFAULT_CREDITS = 2;
export const TRIAL_PROMO_CREDITS = 10;

/** Koniec dnia 31.08.2026 (czas PL / CEST). */
export const TRIAL_PROMO_ENDS_AT = new Date("2026-08-31T21:59:59.999Z");

export const FEEDBACK_EMAIL = "kontakt@generator-ogloszen.com";
export const FEEDBACK_FACEBOOK_URL =
  "https://www.facebook.com/generatorogloszenpl/";

export function isTrialPromoActive(now: Date = new Date()): boolean {
  return now.getTime() <= TRIAL_PROMO_ENDS_AT.getTime();
}

export function getTrialCreditsForSignup(now: Date = new Date()): number {
  return isTrialPromoActive(now) ? TRIAL_PROMO_CREDITS : TRIAL_DEFAULT_CREDITS;
}
