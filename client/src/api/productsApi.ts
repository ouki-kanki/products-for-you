import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../api/baseConfig';
import type { RootState } from '../app/store';
import { AuthEnum } from './enums';

import { convertSnakeToCamel } from '../utils/stringUtils';


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
        url: `latest-products-v4${pageSize && `?${pageSize}`}`
      }),
      // TODO: fis the typsecript errors , have to change the types 
      transformResponse: (response: IProductApiResponse, meta, arg): IProduct[] | undefined => {
        // TODO: grab the paginator from here 
        const results = response.results
        if (!results) {
          return {
            message: 'no products'
          }
        }
        // TODO: if variation does not exist omit the product
        const flattened = results.map(result => {
          convertSnakeToCamel(result)
          const { selectedVariation, ...resultNoSelectedVariation } = result
          const { variationDetails, ...selectedVariationNodetails } = selectedVariation
          const listOfVariations = variationDetails?.reduce((a, variation) => {
            a[variation.variationName] = variation.value
            return a      
          }, {})

          return {
            ...resultNoSelectedVariation,
            ...selectedVariationNodetails,
            listOfVariations
          }
        })

        return flattened
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