import React from 'react'
import { ProductCardV3 } from '../ProductCardV3'
import styles from './similarProducts.module.scss'
import { withLoadingAndError } from '../../../hocs/LoadingError/withLoadingAndError'
import type { IproductItem } from '../../../api/types'
import { useScrollToTop } from '../../../hooks/useScrollToTop'

interface ISimilarProductProps {
  data: IproductItem[]
}

export const SimilarProducts = withLoadingAndError(({ data }: ISimilarProductProps) => {
  const scrollToTop = useScrollToTop()

  const handleDetailsClicked = async () => {
    console.log("clicked sroll to top")
    await scrollToTop()
    console.log("after the promise")
  }

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
            handleClick={handleDetailsClicked}
            isAsyncClicked
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
