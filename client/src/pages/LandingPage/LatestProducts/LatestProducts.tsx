import React from 'react'
import styles from './latestProducts.module.scss';
import { NavLink, Link } from 'react-router-dom';



import { ProductCardV3 } from '../../../components/Product/ProductCardV3';
import { ProductV2 } from '../../../components/Product/ProductV2';
import { Iproduct } from '../../../types';
import { useCarousel } from '../../../hooks/useCarousel';
import { ICarouselOptions, ICarouselContainerProps } from '../../../hooks/useCarousel/carouselTypes';

import { CarouselRoulete } from '../../../hocs/CarouselRoulete';
import { Carousel } from '../../../components/Carousels/Carousel';
import { CarouselV2 } from '../../../components/Carousels/CarouselV2';
import { SwiperCarouselV1 } from '../../../components/Carousels/SwiperCarouselV1';
import { IProduct } from '../../../api/productsApi';

import { SwiperCarouselV2 } from '../../../components/Carousels/SwiperCarouselV2';

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
    console.log("the data", data[4])
  }
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
            {/* <SwiperCarouselV1
              data={data}
              renderProduct={
                (product: IProduct) => (
                  <ProductV2
                    name={product.name}
                    price={product.price}
                    quantity={product.quantity}
                    features={product.features}
                    variations={product.variations}
                    description={product.description}
                    productThumbnails={product.productThumbnails}
                    constructedUrl={product.constructedUrl}
                    id={product.id}
                    slug={product.slug}
                    shadow={false}
                  />
                )
              }>
            </SwiperCarouselV1> */}
          </div>
        </>
      )}
    </div>
  )
}
