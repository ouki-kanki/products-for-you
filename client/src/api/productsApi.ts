import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../api/baseConfig';
import type { RootState } from '../app/store';
import { AuthEnum } from './enums';

export interface IImage {
  id: string;
  image: string;
  isFeatured: boolean
}

export interface ICurrentVariation {
  variationName: string;
  value: string
}

export interface IProductItem {
  name: string;
  quantity: number;
  price: string;
  productImages: Array<IImage>
  currentVariation: Array<ICurrentVariation>;

}


export const productsApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set(AuthEnum.authorization, `Bearer ${token}`)
      }
      return headers
    }
  }),
  endpoints: (builder) => ({
    getLatestProducts: builder.query<Array<IProductItem>, string>({
      query: (pageSize) => ({
        url: `/products/featured-products${pageSize && `?${pageSize}`}`
      }) 
    })
  })
})

export const { useGetLatestProductsQuery } = productsApi