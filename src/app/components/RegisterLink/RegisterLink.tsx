"use client";

import styles from "./RegisterLink.module.css";
import Link from "next/link";
import {usePathname} from "next/navigation";

const RegisterLink = () => {
  const pathname = usePathname();
  const isRegister = pathname.startsWith("/register");

  if (isRegister)
    return (
      <p className={styles.text}>
        Masz już konto?
        <Link
          href="/login"
          className={styles.textLink}
          aria-label="Przejdź do logowania"
          title="Przejdź do logowania"
        >
          Zaloguj się
        </Link>
      </p>
    );
  return (
    <p className={styles.text}>
      Nie masz konta?
      <Link
        href="/register"
        className={styles.textLink}
        aria-label="Przejdź do rejestracji"
        title="Przejdź do rejestracji"
      >
        Załóż je teraz
      </Link>
    </p>
  );
};

export default RegisterLink;
