import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../api/baseConfig';
import type { RootState } from '../app/store/store';
import { AuthEnum } from './enums';

import { convertSnakeToCamel } from '../utils/converters';
import { ICategory } from '../types';

import type { IProduct,
              IproductVariationPreview,
              IproductItem,
              IproductDetail,
              IfeaturedItem
             } from './types';

interface IProductPaginatedResponse {
count: number;
next: string | null;
previous: string | null;
results: IProduct[];
}


const flatAndConvertToCamel = (products: IProduct[]) => {
    return products.map((product: IProduct) => {
    // TODO: correct type
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
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // TODO: this is invalid, check if token will be needed and corect it
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

    getFeaturedProducts: builder.query<IfeaturedItem, string | void>({
      query: (pageSize) => ({
        url: `products/featured${pageSize ? `?pagesize=${pageSize}` : '' }`
      }),
      transformResponse: (response) => {
        convertSnakeToCamel(response)
        const responseCopy = JSON.parse(JSON.stringify(response))
        responseCopy.results.sort((a, b) => a.featuredPosition - b.featuredPosition)
        console.log("after", responseCopy)

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
    getCategories: builder.query<ICategory[], string>({
      query: (featured: string) => ({
        url: featured ? `categories/${featured}` : 'categories/'
      }),
      onQueryStarted: (q) => console.log("Categories query -started--")
    }),
    filterByCategory: builder.query<IProductApiResponse, string>({
      query: (slug) => ({
        url: `products/category/${slug}`
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
  useLazyGetFeaturedProductsQuery,
  useGetPromotedProductsQuery,
  useLazyGetPromotedProductsQuery,
  useGetProductDetailQuery,
  useLazyGetProductDetailQuery,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useLazyFilterByCategoryQuery,
  useLazyGetProductVariationPreviewQuery,
  useFilterByCategoryQuery
} = productsApi
