import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../api/baseConfig';
import type { RootState } from '../app/store';
import { AuthEnum } from './enums';

// export interface IImage {
//   id: string;
//   image: string;
//   isFeatured: boolean
// }

// export interface ICurrentVariation {
//   variationName: string;
//   value: string
// }

// export interface IProductItem {
//   name: string;
//   quantity: number;
//   price: string;
//   productImages: Array<IImage>
//   currentVariation: Array<ICurrentVariation>;
// }

// interface ITestRes {
//   count: number | null;
//   next: number | null;
//   previous: number | null;
//   results: Record<string, unknown>
// }

interface IProductImage {
  id: number;
  image: string;
  is_featured: boolean;
}

interface ICurrentVariation {
  variation_name: string;
  value: string;
}

export interface IProduct {
  name: string;
  quantity: number;
  price: string;
  features: string[];
  product_images: IProductImage[];
  current_variation: ICurrentVariation[];
  category: string[];
}

interface IProductApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IProduct[];
}



export const productsApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}products/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set(AuthEnum.authorization, `Bearer ${token}`)
      }
      return headers
    }
  }),
  endpoints: (builder) => ({
    getLatestProducts: builder.query<IProduct[] | undefined, string>({
      query: (pageSize = '10') => ({
        url: `latest-products${pageSize && `?${pageSize}`}`
      }),
      // TODO: fis the typsecript errors
      transformResponse: (response: IProductApiResponse, meta, arg): IProduct[] | undefined => {
        if (response) {
          return response.results
        }
      } 
    }),
    getFeaturedProducts: builder.query<IProductApiResponse, string>({
      query: (pageSize) => ({
        url: `featured-products${pageSize && `?${pageSize}`}`
      })
    })
  })
})

export const { useGetLatestProductsQuery, useGetFeaturedProductsQuery } = productsApi