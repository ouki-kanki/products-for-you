import React from 'react'
import styles from './carousel.module.scss'
import { dummyItems } from '../../data/dummyItems'
import { useCarousel } from '../../hooks/useCarousel'

interface IDummyItem {
  name: string;
  color: string
}

interface IDummyItemProps {
  item: IDummyItem;
  itemWidth: number
}


const DummyItem = ({ item, itemWidth }: IDummyItemProps) => (
  <div
    className={styles.dummyItem} 
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
export const Carousel = () => {
  const slidesPresended = 1
  const length = dummyItems.length
  const numActive = Math.min(length, slidesPresended)
  const interval = 2000

  const [active, setActive, handlers, style] = useCarousel(length, interval, {
    slidesPresented: numActive
  })

  const beforeIndices = makeIndices(length - 1, -1, numActive)
  const afterIndices = makeIndices(0, +1, numActive)


  return (
    <div className={styles.mainContainer}>
      <div 
        className={`${styles.indicatorContainer} ${styles.left  }`}
        onClick={() => {}}
      >{'<'}</div>
      
      <div
        style={style} 
        className={styles.carouselContainer}>
        {beforeIndices.map(index => (
          <DummyItem key={index} item={dummyItems[index]}/>
        ))}

        {dummyItems.map((item, index) => (
          <DummyItem key={index} item={item}/>
          ))}

        {afterIndices.map(index => (
          <DummyItem key={index} item={dummyItems[index]}/>
        ))}
      </div>

      <div 
        className={`${styles.indicatorContainer} ${styles.right}`}
        onClick={() => {}}
        >{'>'}</div>
    </div>
  )
}
