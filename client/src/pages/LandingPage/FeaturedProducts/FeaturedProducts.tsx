import React, { useState} from 'react'
import styles from './featuredProducts.module.scss';
import { NavLink } from 'react-router-dom';

import { SectionContainer } from '../../../components/Layout/SectionContainer/SectionContainer';
import { ProductCardV3 } from '../../../components/Product/ProductCardV3';
import { Iproduct } from '../../../types';
import { ICarouselContainerProps } from '../../../hooks/useCarousel/carouselTypes';
import { SwiperCarousel } from '../../../components/Carousels/SwiperCarousel';

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

// TODO: THIS IS ONLY FOR FEATURED PRODUCTS DRY THIS
// refactor the response for featured and latest to have the same structure and make this component generic
export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ data }) => {
  const [featuredProducts, setFeaturedProducts] = useState(data)

  // filter the default image
  const renderDefaultThumb = (product): string => {
    // TODO: refactor the response.change the snakecase to camelcase
    const def = product.productImages?.filter(img => img.isDefault)
    return def[0]?.url
  }

  return (
    <SectionContainer
      title='Featured Products'
      linkTitle='more products'
      linkPath='/search?sort_by=time'>
      { data && data.results.length > 0 && (
        <div className={styles.carouselContainer}>
          <SwiperCarousel
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
        </div>
      )}
    </SectionContainer>
  )
}
