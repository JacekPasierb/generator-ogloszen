import React from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  handleNext: () => void;
  handlePrevious: () => void;
  currentPage: number;
  total: number;
}

const Pagination: React.FC<PaginationProps> = ({
  handleNext,
  handlePrevious,
  currentPage,
  total,
}) => {
  return (
    <div className={styles.pagination}>
      <button onClick={handlePrevious} disabled={currentPage === 0}>
        ⬅ Poprzedni
      </button>
      <span>
        {currentPage + 1} / {total}
      </span>
      <button onClick={handleNext} disabled={currentPage === total - 1}>
        Następny ➡
      </button>
    </div>
  );
};

export default Pagination;
