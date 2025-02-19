import React from 'react'
import styles from './featuredProducts.module.scss';
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

interface FeaturedProductsProps extends ICarouselContainerProps {
  // data: Iproduct[];
  data: Idata;
  title: string;
  results: Record<string, unknown>[]
}

// TODO: THIS IS ONLY FOR FEATURED PRODUCTS
// refactor the response for featured and latest to have the same structure and make this component generic
export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ title, data }) => {

  // filter the default image
  const renderDefaultThumb = (product): string => {
    // TODO: refactor the response.change the snakecase to camelcase
    const def = product.productImages?.filter(img => img.isDefault)
    return def[0]?.url
  }

  return (
    <div className={styles.container}>
      { data && data.results.length > 0 && (
        <>
          <h2>{title}</h2>
          <div className={styles.carouselContainer}>
            <SwiperCarouselV2
            data={data.results}
            renderCard={
              (product: Iproduct) => (
                <ProductCardV3
                  product={product}
                  defaultThumb={renderDefaultThumb(product)}
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
