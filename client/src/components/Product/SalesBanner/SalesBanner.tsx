import React from "react";
import styles from './salesBanner.module.scss'
import type { Promotion } from "../../../api/types";

interface SalesBannerProps {
  promotion: Promotion | null;
  size?: 'sm' | 'md' | 'lg'
}

export const SalesBanner = ({ promotion, size = 'md' }: SalesBannerProps) => {
  console.log(promotion)
  return (
    <div className={`${styles.salesBanner} ${styles[`${size}`]}`}>
      <div className={styles.salesName}>
        <div>ON SALE</div>
        <div>
          {promotion?.promo_reduction} % <span>OFF</span>
        </div>
      </div>
    </div>
  );
};
