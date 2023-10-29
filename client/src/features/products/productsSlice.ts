import {  createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../api/baseConfig';

// TODO: convert uppercase to camelcase with a util func
interface Iproduct {
  name: string,
  category: unknown,
  brand: string,
  slug: string,
  product_variations: [],
  first_related: string,
  product_link: string
}

// TODO: implement limit on the back 
export const productsSlice = createApi({
  reducerPath: 'products',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getProducts: builder.query<Iproduct[], number | void>({
      query: (limit = 2) => `/products?limit=${limit}`
    })
  })
})

export const {
  useGetProductsQuery
} = productsSlice