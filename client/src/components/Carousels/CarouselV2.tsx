import { useRef, useState, useEffect, useCallback } from 'react'
import styles from './carousel.module.scss'
import { dummyItems, IDummyItem } from '../../data/dummyItems'
import { useCarouselV2 } from './useCarouselV2';

interface IDummyItemProps {
  item: IDummyItem;
  itemWidth: number;
  activeIndex: number,
  index: number;
}


// *** OBSOLETE ***
const DummyItem = ({ item, itemWidth, activeIndex, index }: IDummyItemProps) => (
  <div
    className={
      `${styles.dummyItem}
       ${index === activeIndex && `${styles.active}`}
       `
      }
    style={{
      backgroundColor:  item.color,
      // width: `${itemWidth}px`
      }}>
    <h2>{item.name}</h2>
  </div>
)

function makeIndices(start: number, delta: number, num: number) {
  const indices: Array<number> = [];

  while (indices.length < num) {
    indices.push(start);
    start += delta;
  }

  return indices;
}


// ** MAIN **
export const CarouselV2 = () => {
  const [products, setProducts] = useState(dummyItems)
  const leftVisible = 2
  const rightVisible = 6
  const numberOfItems = dummyItems.length
  const containerWidth = 800;
  const itemWidth = containerWidth / numberOfItems
  const { moveLeft, moveRight, active } = useCarouselV2(numberOfItems)
  const carouselContainerRef = useRef<HTMLDivElement>(null)


  const handleTransitionEnd = () => {
    if (carouselContainerRef.current) {
      carouselContainerRef.current.style.transition = 'none'
    }
  }

  useEffect(() => {
    // TODO : have to use useCallback check dan abramov solution
    if (carouselContainerRef.current) {
      carouselContainerRef.current.addEventListener('transitionend', handleTransitionEnd)
    }

    return () => {
      carouselContainerRef.current?.removeEventListener('transitionend', handleTransitionEnd)
    }
  }, [])


  const handlePrev = () => {
    moveRight()
    shiftArray('right', itemWidth)
  }

  const handleNext = () => {
    moveLeft()
    shiftArray('left', itemWidth)
  }

  const shiftArray = (direction: 'left' | 'right', itemWidth: number) => {
    if (!carouselContainerRef.current) {
      return
    }

    // TODO: THE LEFT ARROW triggers this !!
    if (direction === 'right') {
      carouselContainerRef.current.style.transition = 'transform .5s ease-in-out';
      carouselContainerRef.current.style.transform = `translateX(-${itemWidth}px)`


      setTimeout(() => {
        setProducts((prevProducts) => {
          const newProducts = [ ...prevProducts ]
          newProducts.push(newProducts.shift() as IDummyItem)
          return newProducts
        })
      }, 500)

      setTimeout(() => {
        carouselContainerRef.current!.style.transition = 'none'
        carouselContainerRef.current!.style.transform = 'translateX(0)'
      }, 501)
    } else if (direction === 'left') {
      setProducts((prevProducts) => {
        const newProducts = [ ...prevProducts ]
        newProducts.unshift(newProducts.pop() as IDummyItem)
        return newProducts
      })

      setTimeout(() => {
        carouselContainerRef.current!.style.transition = 'transform 0.5s linear'
        carouselContainerRef.current!.style.transform = `translateX(-${itemWidth}px)`
      }, 500)

      setTimeout(() => {
        carouselContainerRef.current!.style.transition = 'none'
        carouselContainerRef.current!.style.transform = 'translateX(0)'
      }, 0)
    }
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.hideLeft} style={{ width: `${itemWidth}px` }}></div>
      <div className={styles.hideRight} style={{ width: `${itemWidth}px` }}></div>
      <div
        className={`${styles.indicatorContainer} ${styles.left}`}
        onClick={handlePrev}
      >{'<'}</div>
      <div
        className={styles.carouselContainer}
        // ref={handleRefContainer}
        ref={carouselContainerRef}
        >
        {products.map((item, index) => (
          <DummyItem
            item={item}
            activeIndex={active}
            index={index}
            key={index}
            />
        ))}
      </div>
      <div
        className={`${styles.indicatorContainer} ${styles.right}`}
        onClick={handleNext}
        >{'>'}</div>
    </div>
  )
}
