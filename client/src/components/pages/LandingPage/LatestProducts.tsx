import React from 'react'
import styles from './latestProducts.module.scss';

import { ProductV2 } from '../../Product.tsx/ProductV2';
import { Iproduct } from '../../../types';
import { useCarousel } from '../../../hooks/useCarousel';
import { ICarouselOptions, ICarouselContainerProps } from '../../../hooks/useCarousel/carouselTypes';

import { CarouselRoulete } from '../../../hocs/CarouselRoulete';
import { Carousel } from '../../Carousels/Carousel';
import { CarouselV2 } from '../../Carousels/CarouselV2';

interface IThumbnail {
  id: number;
  thumbnail: string;
}

interface IVariation {
  thumb: string | null;
  url: string | null
} 

interface ILatestProductsProps extends ICarouselContainerProps {
  data: Iproduct[]
}


export const LatestProducts: React.FC<ILatestProductsProps> = ({ data, interval = 5000, slidesPresended = 1, }) => {
  const renderLatestWithSlide = (data) => {
    if (!data) return;
    if (data.length === 0) {
      return <div>no data</div>
    }

    return (
      <div className={styles.containerWithSlide}>
        {
          data.slice(6)
              .filter(product => product.listOfVariations !== undefined)
              .map(({ id, name, price, features }: Iproduct) => (
                <ProductV2
                  key={id}
                  name={name}
                  price={price}
                  features={features}    
                />
            ))
        }
      </div>
    )
  }

  if (data) {
    // console.log(data)
  }

  return (
    <div className={styles.container}>
      <h2>Latest Products</h2>
      {/* {renderLatestWithSlide(data)} */}
      { data && data.length > 0 && (
        // <Carousel/>
        // <CarouselV2/>
        <CarouselRoulete/>
      )}
    </div>
  )
}
