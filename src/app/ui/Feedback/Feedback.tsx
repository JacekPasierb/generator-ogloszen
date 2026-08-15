import styles from "./Feedback.module.css";
import {
  FEEDBACK_EMAIL,
  FEEDBACK_FACEBOOK_URL,
  isTrialPromoActive,
  TRIAL_PROMO_CREDITS,
} from "@/app/config/trial";

const Feedback = () => {
  const promo = isTrialPromoActive();
  const mailHref = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
    "Feedback — Generator Ogłoszeń"
  )}&body=${encodeURIComponent(
    "Cześć!\n\nBrakuje mi / chciałbym:\n\n"
  )}`;

  return (
    <section
      id="feedback"
      className={styles.section}
      aria-labelledby="feedback-heading"
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Feedback</p>
        <h2 id="feedback-heading" className={styles.headline}>
          Czego brakuje?
          <br />
          <span className={styles.headlineAccent}>Napisz do nas.</span>
        </h2>
        <p className={styles.support}>
          {promo
            ? `Do końca sierpnia nowi użytkownicy dostają ${TRIAL_PROMO_CREDITS} kredytów testowych. W zamian prosimy o szczerą opinię — co działa, a czego brakuje.`
            : "Twoja opinia pomaga nam rozwijać generator. Napisz, czego brakuje albo co warto poprawić."}
        </p>

        <div className={styles.actions}>
          <a href={mailHref} className={styles.primary}>
            Wyślij e-mail
          </a>
          <a
            href={FEEDBACK_FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Napisz na Facebooku
          </a>
        </div>

        <p className={styles.hint}>
          E-mail:{" "}
          <a href={mailHref} className={styles.inlineLink}>
            {FEEDBACK_EMAIL}
          </a>
          {" · "}
          albo komentarz pod postem na fanpage’u.
        </p>
      </div>
    </section>
  );
};

export default Feedback;
