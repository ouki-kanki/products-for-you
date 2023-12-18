import React from 'react'
import styles from './latestProducts.module.scss';

import { ProductV2 } from '../../Product.tsx/ProductV2';


export const LatestProducts = ({ data }) => {
  if (data) {
    console.log(data)
  }
  return (
    <div className={styles.container}>
      <h2>Latest Products</h2>
      <div className={styles.productContainer}>
        container
      </div>
    </div>
  )
}
