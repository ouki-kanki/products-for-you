import React from 'react'
import styles from './featuredProduct.module.scss'

import { IProduct } from '../../../api/productsApi'

import { ProductV2 } from '../../Product.tsx/ProductV2'

interface IFeaturedProductProps {
  data: IProduct
} 

export const FeaturedProduct = ({ data }: IFeaturedProductProps) => {
  return (
    <div className={styles.container}>
      <h2>Featured Product</h2>
      <div className={styles.featuredProductContainer}>
        <ProductV2
          width='wide'
          name={data.name}
          price={data.price}
          features={data.features}
          description={data.description}
        />
      </div>
    </div>
  )
}
