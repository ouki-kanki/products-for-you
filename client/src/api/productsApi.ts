import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../api/baseConfig';
import type { RootState } from '../app/store/store';
import { AuthEnum } from './enums';

import { convertSnakeToCamel } from '../utils/stringUtils';
import { ICategory } from '../types';

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
  slug: string;
  productUrl: string;
  thumb: string;
}

interface IProductThumbnailorImage {
  isDefault: boolean;
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

export interface IproductVariationPreview {
  quantity: number;
  price: string;
  productThumbnails: IProductThumbnailorImage[];
  variationDetails: ICurrentVariation[];
  slug: string;
  constructedUrl: string;
}

// TODO: DRY THIS there are simiral properties
export interface IproductDetail {
  id: number;
  slug: string;
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

// TODO: categories falls under /products/categories
// have to create a different api for categories and change the url to just /categories/

export const productsApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
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
        url: `products/latest${pageSize && `?${pageSize}`}`
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
        url: `products/featured${pageSize && `?${pageSize}`}`
      })
    }),
    getProductDetail: builder.query<IproductDetail, string | null>({
      query: (slug) => ({
        url: `products/product-detail/${slug}`
      }),
      transformResponse: ((response: IproductDetail, meta, arg) => {
        convertSnakeToCamel(response)
        return response
      })
    }),
    getProductVariationPreview: builder.query<IproductVariationPreview, string | null>({
       query: (slug) => ({
        url: `products/product-preview/${slug}`
       }),
       transformResponse: ((response: IproductVariationPreview, meta, arg) => {
        convertSnakeToCamel(response)
        return response
       })
    }),
    getCategories: builder.query<ICategory[], void>({
      query: () => ({
        url: `categories/`
      })
    }),
    filterByCategory: builder.query<IProductApiResponse, number>({
      query: (id) => ({
        url: `products/category/${id}`
      }),
      transformResponse: (response) => {
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
  useLazyFilterByCategoryQuery,
  useLazyGetProductVariationPreviewQuery,
  useFilterByCategoryQuery
} = productsApi
