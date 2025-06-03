import React from 'react'
import styles from './latestProducts.module.scss';
import { NavLink } from 'react-router-dom';

import { ProductCardV3 } from '../../../components/Product/ProductCardV3';
import { Iproduct } from '../../../types';
import { ICarouselContainerProps } from '../../../hooks/useCarousel/carouselTypes';
import { SwiperCarouselV2 } from '../../../components/Carousels/SwiperCarouselV2';

interface ILatestProductsProps extends ICarouselContainerProps {
  data: Iproduct[]
}

export const LatestProducts: React.FC<ILatestProductsProps> = ({ data }) => {


  const renderDefaultThumb = (product: Iproduct) => {
      const def = product.productThumbnails?.filter((thumb: {isDefault: boolean, url: string }) => thumb.isDefault)

      return def ? def[0]?.url : "no image"
  }

  return (
    <div className={styles.container}>
      { data && data.length > 0 && (
        <>
          <h2>Latest Products</h2>
          {/* <div className={styles.carouselContainer}> */}
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
              <NavLink
                to='/search?sort_by=time'
              >more products</NavLink>
            </div>
          {/* </div> */}
        </>
      )}
    </div>
  )
}
