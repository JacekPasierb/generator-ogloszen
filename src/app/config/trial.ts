/** Domyślny trial dla nowych kont. */

export const TRIAL_DEFAULT_CREDITS = 2;

export const FEEDBACK_EMAIL = "kontakt@generator-ogloszen.com";
export const FEEDBACK_FACEBOOK_URL =
  "https://www.facebook.com/generatorogloszenpl/";

export function getTrialCreditsForSignup(): number {
  return TRIAL_DEFAULT_CREDITS;
}
