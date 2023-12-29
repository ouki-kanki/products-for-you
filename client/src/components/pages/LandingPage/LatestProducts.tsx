import React from 'react'
import styles from './latestProducts.module.scss';

import { ProductV2 } from '../../Product.tsx/ProductV2';
import { Iproduct } from '../../../types';
import { useCarousel } from '../../../hooks/useCarousel';
import { ICarouselOptions, ICarouselContainerProps } from '../../../hooks/useCarousel/carouselTypes';

import { CarouselRoulete } from '../../../hocs/CarouselRoulete';
import { Carousel } from '../../Carousels/Carousel';
import { CarouselV2 } from '../../Carousels/CarouselV2';
import { SwiperCarouselV1 } from '../../Carousels/SwiperCarouselV1';

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

  return (
    <div className={styles.container}>
      <h2>Latest Products</h2>
      {/* {renderLatestWithSlide(data)} */}
      { data && data.length > 0 && (
        // <Carousel/>
        <div>
          {/* <CarouselV2/> */}
          {/* <CarouselRoulete/> */}
          <ProductV2
            name={data[0].name}
            price={data[0].price}
          />
          {/* <SwiperCarouselV1 data={data}/> */}
        </div>
      )}
    </div>
  )
}
