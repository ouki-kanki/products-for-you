import React from 'react'
import styles from './promotedProducts.module.scss'

import { ProductCardV3 } from '../../../components/Product/ProductCardV3'
import { SwiperCarouselV2 } from '../../../components/Carousels/SwiperCarouselV2'
import type { IproductItem } from '../../../api/types'
import { Link } from 'react-router-dom'


interface PromotedProductProps {
  data: IproductItem;
  isLoading: boolean;
  isError: boolean
}

// TODO: this is the same as the latest products .refactor
export const PromotedProducts: React.FC<PromotedProductProps> = ({ data, isLoading, isError }) => {
  const renderDefaultThumb = (product: Iproduct) => {
    const def = product.productThumbnails?.filter((thumb: {isDefault: boolean, url: string }) => thumb.isDefault)

    return def ? def[0]?.url : "no image"
  }

  if (isLoading) {
    return (
      <div>isLoading</div>
    )
  }

  if (isError) {
    return (
      <div>isError</div>
    )
  }

  return (
    <>
      <h2>Promoted Products</h2>
      <div className={styles.carouselContainer}>
        <SwiperCarouselV2
              data={data}
              renderCard={
                (product: Iproduct) => (
                  <ProductCardV3
                    product={product}
                    url={product.constructedUrl}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    defaultThumb={renderDefaultThumb(product)}
                  />
                )
              }
              />
              <div className={styles.linkRight}>
                <Link
                  to='/search?sort_by=time'
                >more products</Link>
              </div>
      </div>
    </>
  )
}
