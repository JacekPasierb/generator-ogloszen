import React, { ReactNode } from "react";
import styles from "./SubTitle.module.css";

interface SubTitleProps {
  children: ReactNode;
}

const SubTitle: React.FC<SubTitleProps> = ({children}) => {
  return <p className={styles.subtitle}>{children}</p>;
};

export default SubTitle;
