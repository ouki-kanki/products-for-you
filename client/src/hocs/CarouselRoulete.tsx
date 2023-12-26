import { useState, ReactNode } from 'react'
import { ICarouselContainerProps } from '../hooks/useCarousel/carouselTypes'
import styles from './carouselRoulete.module.scss';

import { useCarouselV2 } from '../hooks/useCarousel/useCarouselV2';
import { useCarouselV3 } from '../hooks/useCarousel/useCarouselV3';

import { dummyItems } from '../data/dummyItems';


interface IRuleteProps extends ICarouselContainerProps {
  children: ReactNode;
  data: Array<Record<string, string>>;
  visibleSlides: number;
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
  }).reverse()
}



export const CarouselRoulete = ({ children, interval, visibleSlides = 5, data }: IRuleteProps) => {
  let itemsLength;
  const length = dummyItems.length
  if (data) {
      itemsLength = data.length
  }
  const [activeIndex, setActiveIndex] = useState(3)

  // const [active, setActive, handlers, style] = useCarouselV2({
  //   length,
  //   interval: 5000,
  //   options: {
  //     slidesPresented: visibleSlides 
  //   }
  // })

  
  
  const carouselContainerLength = 800;
  const numberOfprevOrPostItems = 2;
  
  const numberOfVisibleItems = (numberOfprevOrPostItems * 2) + 1
  const itemWidth = carouselContainerLength / numberOfVisibleItems
  // console.log(itemWidth)
  const totalNumberOfItems = numberOfprevOrPostItems + 2
  
  const { toNextItem, toPrevItem, active, offset } = useCarouselV3(length, 500, itemWidth, activeIndex)

  const renderDummy = (item: { name: string, color: string }) => (
    <div
      className={styles.dummyItem} 
      style={{ 
        backgroundColor:  item.color,
        width: `${itemWidth}px`
        }}>
      <h2>{item.name}</h2>
    </div>
  )


  // 1 more item to the left and to right hidden 
  const prevIndeces = makePrevIndices(dummyItems.length, 3, active)
  const postIndeces = makePostIndices(dummyItems.length, 3, active)
  

  return (
    <div 
      className={`${styles.mainContainer}`}>
      <div 
        className={`${styles.indicatorContainer} ${styles.left}`}
        // onClick={handlePrev}
        onClick={toNextItem}
        >{'<'}</div>
      <div 
        className={styles.carouselContainer}
        style={{
          width: `${carouselContainerLength}px`,
          transform: `translateX(${offset}px)`,
          // transform: `translateX(-${activeIndex * itemWidth}px)`,
          transition: `transform 0.5s ease`
        }}
        >
        {prevIndeces?.map(index => (
          <div className={styles.carouselItem} style={{ width: `${itemWidth}px` }}>
            {renderDummy(dummyItems[index])}
          </div>
        ))}
        <div 
          className={`${styles.carouselItem} ${styles.active}`}
          style={{ width: `${itemWidth}px` }}
          >
          {renderDummy(dummyItems[active])}
        </div>
        {postIndeces?.map(index => (
          <div 
            className={styles.carouselItem}
            style={{ width: `${itemWidth}px` }}
            >
            {renderDummy(dummyItems[index])}
          </div>
        ))}
      </div>
      <div 
        className={`${styles.indicatorContainer} ${styles.right}`}
        onClick={toPrevItem}
        >{'>'}</div>
    </div>
  )
}



