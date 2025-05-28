import styles from "./BtnAuth.module.css";

interface BtnAuthProps {
  isSubmitting?: boolean;
  children?: React.ReactNode;
}

const BtnAuth = ({isSubmitting = false, children}: BtnAuthProps) => {
  return (
    <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
      {isSubmitting ? <div className={styles.spinner} /> : children}
    </button>
  );
};

export default BtnAuth;
