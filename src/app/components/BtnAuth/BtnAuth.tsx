import React from "react";
import styles from "./BtnAuth.module.css";

interface BtnAuthProps {
  isSubmitting: boolean;
  children?: React.ReactNode;
}

const BtnAuth: React.FC<BtnAuthProps> = ({isSubmitting, children}) => {
  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? <div className={styles.spinner} /> : children}
    </button>
  );
};

export default BtnAuth;
