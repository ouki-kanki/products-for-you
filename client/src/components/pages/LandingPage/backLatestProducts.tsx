import React from 'react'
import styles from './latestProducts.module.scss';

import { ProductV2 } from '../../Product.tsx/ProductV2';
import { useCarousel } from '../../../hooks/useCarousel';
import { ICarouselOptions, ICarouselContainerProps } from '../../../hooks/useCarousel/carouselTypes';
import { Iproduct } from '../../../types';

import { CarouselRoulete } from '../../../hocs/CarouselRoulete';

interface IThumbnail {
  id: number;
  thumbnail: string;
}

interface IVariation {
  thumb: string | null;
  url: string | null
} 

interface ILatestProductsProps extends ICarouselContainerProps {
  data: Iproduct
}

function makeIndices(start: number, delta: number, num: number) {
  const indices: Array<number> = [];

  while (indices.length < num) {
    indices.push(start);
    start += delta;
  }
  return indices;
}


export const LatestProducts: React.FC<CarouselContainerProps> = ({ data, interval = 5000, slidesPresended = 1, }) => {
  const length = data?.length || 0

  // if the number of slides presented is bigger that the length choose the length
  const numActive = Math.min(length, slidesPresended)
  const [active, setActive, handlers, style] = useCarousel({
    length,
    interval,
    options: {
      slidesPresented: numActive
    }
  })


  console.log("the active", active)
  // products before the active product
  const beforeIndices = makeIndices(length - 1, -1, numActive)
  // products after the active product
  const afterIndices = makeIndices(0, +1, numActive)

  /**
   * 
   * @param length  the lenght of the array of products
   * @param numberOfPrevElements number of element to show before the active element
   * @param activeIndex the index of the active element
   */
  const prevIndices = (length: number, numberOfPrevElements: number, activeIndex: number) => {
    return [ ...Array(numberOfPrevElements) ].map(_ => {
      const temp = numberOfPrevElements
      numberOfPrevElements -= 1

      return (activeIndex - temp + length) % length
    })
  }

  /**
   * 
   * @param length (number) the length of the array of products
   * @param numberOfpostElements (number) number of elements to show after the active product
   * @param activeIndex (number) index of the active element
   * @returns 
   */
  const postIndices = (length: number, numberOfpostElements: number, activeIndex: number) => {
    return [ ...Array(numberOfpostElements)].map(_ => {
      const temp = numberOfpostElements
      numberOfpostElements -= 1

      return (activeIndex + temp) % length
    }).reverse
  }


  let activeItem;
  if (data) {
    // console.log(data)
    activeItem = data[active]
    // console.log("the active item", activeItem)

    const prevArr = prevIndices(length, 2, active)
    // console.log(prevArr)

  }



  return (
    <div className={styles.container}>
      <h2>Latest Products</h2>
      <div className={styles.productsContainer}>
        {data && data.slice(6)
          .filter(product => product.listOfVariations !== undefined)
            .map(({ id, name, price, features }: Iproduct) => (
          <ProductV2
            key={id}
            name={name}
            price={price}
            features={features}    
          />
        ))}
      </div>
      { length > 0 && (
        <CarouselRoulete/>

        // <div className={styles.carousel}>
        //   <ol className={styles.carouselIndicators}>
        //     {data && data.map((item, index: number) => (
        //       <li
        //         onClick={() => setActive(index)}
        //         key={index}
        //         className={`${active === index ? styles.active : ''} ${styles.carouselIndicator}`}
        //       >{item.name}</li>
        //     ))}
        //   </ol>

        //   <div 
        //     className={styles.carouselContent} 
        //     { ...handlers }
        //     style={style}
        //     >

          {/* {beforeIndices.map(i => {
              const item = data[i]
              return (
                <div className={styles.carouselItem}>
                  <ProductV2
                    name={item.name}
                    price={item.price}
                    />
                </div>
              )
          })} */}

          {/* {data.map((item, index) => (
            <ProductV2
              name={item.name}
              price={item.price}
            />
          ))} */}

          {/* {afterIndices.map(i => {
            const item = data[i]
            return (
              <ProductV2
                name={item.name}
                price={item.price}
              />
            )
          })} */}

              {/* {beforeIndices.map(i => (
                <div className={styles.carouselItem} key={i}>
                  <ProductV2
                    name={data[i].name}
                    price={data[i].price}
                    features={data[i].features}
                  />
                </div>
              ))} */}
            {/* 
              {
                prevIndices(length, 2, active).map(index => {
                  const product = data[index]
                  // the distance of the currenct index from the active element index
                  const distance = (active - index + length) % length
                  
                  return (
                  <div className={styles.carouselItem} style={{
                  }}>
                    <div style={{ 
                      height: `${(1 - (distance * 0.1)) * 100 }%`,
                      width: `${(1 - (distance * 0.1)) * 100}%`
                      }}>
                      <ProductV2
                        name={product.name}
                        price={product.price}
                        features={product.features}
                      />
                    </div>
                  </div>
                  )
                })
              } 
              {
                <div className={styles.carouselItem}>
                  <ProductV2
                    name={activeItem.name}
                    price={activeItem.price}
                    features={activeItem.features}
                  />
                </div>
              } */}

              {/* {data.map((product, index) => (
                <div className={styles.carouselItem}>
                  <ProductV2
                    name={product.name}
                    price={product.price}
                    features={product.features}
                  />
                </div>
                ))} */}
{/* 
              {afterIndices.map(i => (
                <div className={styles.carouselItem} key={i}>
                  <ProductV2
                    name={data[i].name}
                    price={data[i].price}
                    features={data[i].features}
                  />
                </div>
              ))} */}

      //       </div>
      //   </div>
      )}
    </div>
  )
}
