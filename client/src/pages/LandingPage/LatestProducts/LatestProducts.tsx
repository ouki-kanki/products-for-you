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

  return (
    <div className={styles.container}>
      {/* <h2>Latest Products</h2> */}
      { data && data.length > 0 && (
        <>
          <h2>Latest Products</h2>
          <div className={styles.carouselContainer}>
            <SwiperCarouselV2
            data={data}
            renderProduct={
              (product: Iproduct) => (
                <ProductCardV3
                  product={product}
                />
              )
            }
            />
            <div className={styles.linkRight}>
              <NavLink
                to='/search?sort_by=time'
                // replace=false
              >more products</NavLink>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
