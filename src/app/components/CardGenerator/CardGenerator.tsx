import React from "react";
import styles from "./CardGenerator.module.css"

interface CardGeneratorProps {
  example: {
    title: string;
    desc: string;
  };
}

const CardGenerator: React.FC<CardGeneratorProps> = ({example}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{example.title}</h3>
      <p className={styles.description}>{example.desc}</p>
    </div>
  );
};

export default CardGenerator;
