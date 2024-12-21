import React from 'react'
import styles from './productList.module.scss';
import { NavLink } from 'react-router-dom';

import { ProductCardV3 } from '../../../components/Product/ProductCardV3';
import { Iproduct } from '../../../types';
import { ICarouselContainerProps } from '../../../hooks/useCarousel/carouselTypes';
import { SwiperCarouselV2 } from '../../../components/Carousels/SwiperCarouselV2';

// TODO: move from here to types
interface Idata {
  count: number;
  next: number;
  previous: number;
  results: Record<string, unknown>[]
}

interface ILatestProductsProps extends ICarouselContainerProps {
  // data: Iproduct[];
  data: Idata;
  title: string;
  results: Record<string, unknown>[]
}

export const ProductList: React.FC<ILatestProductsProps> = ({ title, data }) => {
  console.log("the data yo", data)
  return (
    <div className={styles.container}>
      { data && data.results.length > 0 && (
        <>
          <h2>{title}</h2>
          <div className={styles.carouselContainer}>
            <SwiperCarouselV2
            data={data.results}
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
