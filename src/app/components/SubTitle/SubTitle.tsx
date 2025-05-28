import React, {ReactNode} from "react";
import styles from "./SubTitle.module.css";

interface SubTitleProps {
  children: ReactNode;
}

const SubTitle = ({children}: SubTitleProps) => {
  return <p className={styles.subtitle}>{children}</p>;
};

export default SubTitle;
