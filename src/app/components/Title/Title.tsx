import React, {ReactNode} from "react";
import styles from "./Title.module.css";

interface TitleProps {
  children: ReactNode;
}

const Title = ({children}: TitleProps) => {
  return <h2 className={styles.title}>{children}</h2>;
};

export default Title;
