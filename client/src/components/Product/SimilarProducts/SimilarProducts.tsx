import React from 'react'
import { ProductCardV3 } from '../ProductCardV3'
import styles from './similarProducts.module.scss'
import { withLoadingAndError } from '../../../hocs/LoadingError/withLoadingAndError'
import type { IproductItem } from '../../../api/types'


interface ISimilarProductProps {
  data: IproductItem[]
}

export const SimilarProducts = withLoadingAndError(({ data }: ISimilarProductProps) => {
  console.log("the data", data)

  return (
    <div className={styles.container}>
      {data && data.map(product => (
        <div
          key={product.slug}
          className={styles.productCardContainer}
        >
          <ProductCardV3
            price='20'
            defaultThumb={product.product_images[0]?.url}
            product={{
              name: product.name,
              constructedUrl: product.constructed_url,
              price: product.price,
              slug: product.slug
            }}
          />
        </div>
      ))}
    </div>
  )
})
