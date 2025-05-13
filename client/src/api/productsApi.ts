import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../api/baseConfig';
import type { RootState } from '../app/store/store';
import { AuthEnum } from './enums';

import { convertSnakeToCamel } from '../utils/converters';
import { ICategory } from '../types';
import { ICartItem, CartItemForServer } from '../types/cartPayments';


import type { IProduct,
              IproductVariationPreview,
              IproductItem,
              IproductDetail,
              FeaturedItems
             } from './types';

interface IProductPaginatedResponse {
count: number;
next: string | null;
previous: string | null;
results: IProduct[];
}

interface IsimilarProductsParams {
  slug: string;
  category: string;
  tag?: string;
  brand?: string
}

interface ItemQnt {
  uuid: string;
  quantity: number;
}

export interface ProductItemQntsResponse {
  items: ItemQnt[]
}

// TODO: userapi uses baseAuthApi .have to check if i can use it here to dry the code
export const productsApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.userTokens.accessToken
      if (token) {
        headers.set(AuthEnum.authorization, `Bearer ${token}`)
      }
      return headers
    },
    // credentials: 'include'
  }),
  endpoints: (builder) => ({
    getLatestProducts: builder.query<IProduct[] | undefined, string>({
      query: (pageSize = '10') => ({
        url: `products/latest${pageSize && `?${pageSize}`}`
      }),
      // TODO: fis the typsecript errors , have to change the types
      transformResponse: (response: IProductPaginatedResponse, meta, arg): IProduct[] | undefined => {
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

    getFeaturedProducts: builder.query<FeaturedItems, string | void>({
      query: (pageSize) => ({
        url: `products/featured${pageSize ? `?pagesize=${pageSize}` : '' }`
      }),
      transformResponse: (response) => {
        convertSnakeToCamel(response)
        const responseCopy = JSON.parse(JSON.stringify(response))
        responseCopy.results.sort((a, b) => a.featuredPosition - b.featuredPosition)

        return responseCopy;
      }
    }),
    getPromotedProducts: builder.query<IproductItem, void>({
      query: () => ({
        url: `products/promoted`
      }),
      transformResponse: (response) => {
        convertSnakeToCamel(response)
        return response
      }
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
    getSimilarProducts: builder.query<IproductItem, IsimilarProductsParams>({
      query: (params) => ({
        url: 'products/similar',
        params
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
    // TODO: jsdoc. inform that featured can be fetch from here as an option
    getCategories: builder.query<ICategory[], string | undefined>({
      query: (featured?: string) => ({
        url: featured ? `categories/${featured}` : 'categories/'
      }),
      onQueryStarted: (q) => {
        // console.log("Categories query -started--")
    }}),
    // TODO: obsolete. was used inside categories
    filterByCategory: builder.query<IProductApiResponse, string>({
      query: (slug) => ({
        url: `products/category/${slug}`
      }),
      transformResponse: (response) => {
        return response
      }
    }),
    getItemQuantities: builder.mutation<ProductItemQntsResponse, string[]>({
      query: (uuid_list) => ({
        url: 'products/quantities',
        method: 'POST',
        body: { uuid_list }
      })
    })
  })
})

export const {
  useGetLatestProductsQuery,
  useGetFeaturedProductsQuery,
  useLazyGetFeaturedProductsQuery,
  useGetPromotedProductsQuery,
  useLazyGetPromotedProductsQuery,
  useGetProductDetailQuery,
  useLazyGetProductDetailQuery,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useLazyFilterByCategoryQuery,
  useLazyGetProductVariationPreviewQuery,
  useFilterByCategoryQuery,
  useLazyGetSimilarProductsQuery,
  useGetItemQuantitiesMutation
} = productsApi
