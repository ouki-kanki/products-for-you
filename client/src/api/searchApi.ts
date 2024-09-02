import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./baseConfig";
// import type { BaseQueryFn } from '@reduxjs/toolkit/query'


export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL
  }),
  endpoints: (builder) => ({
    searchProductItem: builder.query({
      query: (query) => ({
          url: `search/product-items/`,
          params: {
            search: query
        }
      }),
      transformResponse: (response, meta, arg) => {
        return response
      },
      transformErrorResponse: (response: { status: string | number }, meta, arg) => response.status
    }),
    sugestProductName: builder.query<string[], string>({
      query: (query) => ({
        url: `search/product-items/suggest/`,
        params: {
          suggest: query
        }
      }),
      transformResponse: (response) => {
        // console.log("the response from sugest", response)
        return response
      }
    })
  })
})


export const {
  useSearchProductItemQuery,
  useLazySugestProductNameQuery
} = searchApi
