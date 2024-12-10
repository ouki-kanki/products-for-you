import React, { useEffect, useCallback } from 'react'
import { useLazyGetFeaturedProductsQuery } from '../../api/productsApi'

import { SwiperCarouselV2 } from '../../components/Carousels/SwiperCarouselV2'

export const FeaturedProducts = () => {
  // const { data, isLoading, isError, error, isSuccess } = useGetFeaturedProductsQuery()
  const [trigger, { data, isLoading, isError, error}] = useLazyGetFeaturedProductsQuery()

  console.log("the featuer products is now")

  useEffect(() => {
    const id = setTimeout(() => {
      console.log("trigger request")
      trigger()
    }, 600)

    return () => {
      clearTimeout(id)
    }
  },[trigger])

  console.log("the featured", data)

  return (
    <div>
      <h2>Featured Products</h2>
    </div>
  )
}
