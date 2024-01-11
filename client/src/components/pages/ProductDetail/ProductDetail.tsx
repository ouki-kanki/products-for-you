import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetProductDetailQuery } from '../../../api/productsApi'

export const ProductDetail = () => {
  const { slug } = useParams()
  const { data } = useGetProductDetailQuery(slug as string)


  console.log(data)
  console.log(slug)
  return (
    <div>ProductDetail</div>
  )
}
