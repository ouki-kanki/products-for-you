import { useState, useEffect, useRef, PropsWithChildren, ReactNode } from 'react'
import styles from './swiperCarousel.module.scss'
import { dummyItems, IDummyItem } from '../../data/dummyItems'
import { useWindowSize } from '../../hooks/useWindowSize';

import type { Iproduct } from '../../types';

import "swiper/css";
import 'swiper/css/navigation'
import 'swiper/css/pagination'


import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Navigation, Pagination, Autoplay } from 'swiper/modules'

import { register } from 'swiper/element/bundle'



interface IDummyItemProps {
  item: IDummyItem;

}

const DummyItem = ({ item }:  IDummyItemProps) => (
  <div
    className={styles.dummyItem}
    style={{ backgroundColor: item.color}}>
    <h2>{item.name}</h2>
  </div>
)


interface IItem {
  [k: string]: unknown
}

interface ISwipperCarouselV1Props {
  data: Array<Iproduct>;
  renderCard: (item: IItem) => ReactNode
}

export const SwiperCarouselV2 = ({ data,  renderCard}: ISwipperCarouselV1Props ) => {
  const [ windowWidth ] = useWindowSize()
  const [numberOfVisible, setNumberOfVisible] = useState(3)


  /**
   * need to bring the number of items for each instance as a prop
   * use this number as the max value that numberOfVisible can get.
   * now if the number of items is less than the max-number that is defined below
   * carousel breaks.it needs to have at least for items in order to work properly
   */

  useEffect(() => {
    if (windowWidth >= 2200) {
      setNumberOfVisible(4)
    } else if (windowWidth >= 1700) {
      setNumberOfVisible(4)
    } else if (windowWidth >= 1300) {
      setNumberOfVisible(4)
    } else if (windowWidth >= 1000) {
      setNumberOfVisible(3)
    } else if (windowWidth >= 700) {
      setNumberOfVisible(2)
    } else {
      setNumberOfVisible(1)
    }
  }, [windowWidth])


  // console.log("the data", data)

  return (
    <div className={styles.container}>
      <Swiper
        className={styles.swiper}
        navigation
        loop

        // autoplay={{
        //   delay: 3000,
        //   disableOnInteraction: false
        // }}
        pagination={{
          clickable: true
        }}
        modules={[EffectCards, Navigation, Pagination, Autoplay]}
        centeredSlides={false}
        // effect='cards'
        spaceBetween={2}
        slidesPerView={numberOfVisible}
        // slidesPerGroup={numberOfVisible}
        // slidesPerView={1}
        // onSlideChange={() => console.log('slide change')}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        {
          data && data.map((item, index) => (
            <SwiperSlide key={index}>{renderCard(item)}</SwiperSlide>
          ))
        }
        {/* {
          dummyItems.map(item => (
            <SwiperSlide>
              <DummyItem item={item} key={item.id}/>
            </SwiperSlide>
          ))
        } */}
      </Swiper>
    </div>
  )
}
