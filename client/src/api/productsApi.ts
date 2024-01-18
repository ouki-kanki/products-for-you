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

interface IVariation {
  productUrl: string;
  thumb: string;
}

interface IProductThumbnailorImage {
  isFeatured: boolean;
  url: string
}

export interface IProduct {
  name: string;
  quantity: number;
  price: string;
  features: string[];
  product_images: IProductImage[];
  current_variation: ICurrentVariation[];
  category: string[];
  description: string;
  variations: IVariation[];
  productThumbnails: IProductThumbnailorImage[];
  slug: string;
  constructedUrl: string;
  id: number;
}

// TODO: DRY THIS there are simiral properties
export interface IproductDetail {
  id: number;
  name: string;
  variationName: string
  sku: string;
  price: number;
  quantity: string;
  detailedDescription: string;
  features: string[];
  icon: string;
  categories: string[];
  productThumbnails: IProductThumbnailorImage[];
  productImages: IProductThumbnailorImage[]
}

interface IProductApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IProduct[];
}

interface ICategory {
  id: number;
  name: string;
  icon: string;
  children: ICategory[]
}

const flatAndConvertToCamel = (products) => {
    return products.map((product: IProduct) => {
    convertSnakeToCamel(product)
    const { selectedVariation, ...resultNoSelectedVariation } = product
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
    }),
    getProductDetail: builder.query<IproductDetail, string | null>({
      query: (slug) => ({
        url: `product-items-detail-v4/${slug}`
      }),
      transformResponse: ((response: IproductDetail, meta, arg) => {
        // TODO: propably this is ok but check if causes issues because it mutates the response
        convertSnakeToCamel(response)
        return response
      })
    }),
    getCategories: builder.query<ICategory[], void>({
      query: () => ({
        url: `categories`
      })
    }),
    filterByCategory: builder.query<IProductApiResponse, number>({
      query: (id) => ({
        url: `by-category/${id}`
      }),
      transformResponse: (response) => {
        // console.log(response)
        return response
      } 
    })
  })
})

export const { 
  useGetLatestProductsQuery, 
  useGetFeaturedProductsQuery, 
  useGetProductDetailQuery,
  useGetCategoriesQuery,
  useLazyFilterByCategoryQuery
} = productsApi