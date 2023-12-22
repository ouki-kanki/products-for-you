import { useState, ReactNode } from 'react'
import { ICarouselContainerProps } from '../hooks/useCarousel/carouselTypes'
import styles from './carouselRoulete.module.scss';

import { useCarousel } from '../hooks/useCarousel/useCarouselV2';
import { dummyItems } from '../data/dummyItems';


interface IRuleteProps extends ICarouselContainerProps {
  children: ReactNode,
  data: Array<Record<string, string>>
}

/**
 * 
 * @param length  the lenght of the array of products
 * @param numberOfPrevElements number of element to show before the active element
 * @param activeIndex the index of the active element
 */
const makePrevIndices = (length: number, numberOfPrevElements: number, activeIndex: number) => {
  if (! length) return
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
const makePostIndices = (length: number, numberOfpostElements: number, activeIndex: number) => {
  if (!length) return
  return [ ...Array(numberOfpostElements)].map(_ => {
    const temp = numberOfpostElements
    numberOfpostElements -= 1

    return (activeIndex + temp) % length
  }).reverse
}



export const CarouselRoulete = ({ children, interval, slidesPresented, data }: IRuleteProps) => {
  let itemsLength;
  const length = dummyItems.length
  if (data) {
      itemsLength = data.length
  }

  const [activeIndex, setActiveIndex] = useState(3)

  const [active, setActive, handlers, style] = useCarousel({
    length,
    interval: 5000,
    options: {
      slidesPresented 
    }
  })


  const prevIndeces = makePrevIndices(dummyItems.length, 2, activeIndex)
  const postIndeces = makePostIndices(dummyItems.length, 2, activeIndex)

  // console.log(prevIndeces)
  // console.log(active)

  return (
    <div className={`${styles.mainContainer} ${styles.left}`}>
      <div className={styles.indicatorContainer}></div>
      <div className={styles.contentContainer}>
        {data && data.map((item, index) => (
          <div 
            className={`${styles.carouselItem} `}
          ></div>
        ))}
      </div>
      <div className={`${styles.indicatorContainer} ${styles.right}`}></div>
    </div>
  )
}
