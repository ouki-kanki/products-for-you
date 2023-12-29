import React, { useState, useEffect, useRef } from 'react'
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

const DummyItem = ({ item }: IDummyItemProps) => (
  <div
    className={styles.dummyItem} 
    style={{ backgroundColor: item.color}}>
    <h2>{item.name}</h2>
  </div>
)


interface ISwipperCarouselV1Props {
  data: Array<Iproduct>
}

export const SwiperCarouselV1 = ({ data }: ISwipperCarouselV1Props) => {
  const [ windowWidth ] = useWindowSize()
  const [numberOfVisible, setNumberOfVisible] = useState(3)
  
  useEffect(() => {
    if (windowWidth >= 1700) {
      setNumberOfVisible(5)
    } else if (windowWidth >= 650) {
      setNumberOfVisible(3)
    } else {
      setNumberOfVisible(1)
    }  
  }, [windowWidth])


  return (
    <div>
      <h2>Swiper Carousel V1</h2>
      <Swiper
        navigation
        loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
        pagination={{
          clickable: true
        }}
        modules={[EffectCards, Navigation, Pagination, Autoplay]}
        centeredSlides={true}
        // effect='cards'
        spaceBetween={2}
        slidesPerView={numberOfVisible}
        // onSlideChange={() => console.log('slide change')}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        {
          dummyItems.map(item => (
            <SwiperSlide>
              <DummyItem item={item} key={item.id}/>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  )
}
