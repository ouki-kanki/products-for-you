import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./baseConfig";
// import type { BaseQueryFn } from '@reduxjs/toolkit/query'

interface SearchProductItem {
  thumb: string;
  image: string;
  name: string;
  categories: string[];
  description: string;
  slug: string;
  sku: string;
  upc: string;
  price: string;
  is_default: boolean;
  availability: string;
}

interface ListResponse<T> {
  next: string | null;
  prev: string | null;
  total_items: number;
  num_of_pages: number;
  per_page: number;
  results: T[]
}

type QueryParams = {
  query: string;
  page?: number;
  page_size?: number;
  sort_by?: number;
}

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL
  }),
  endpoints: (builder) => ({
    searchProductItem: builder.query<ListResponse<SearchProductItem>, QueryParams>({
      query: ({
        query,
        page,
        page_size,
        sort_by
      }) => ({
          url: `search/product-items/`,
          params: {
            search: query,
            page,
            page_size,
            sort_by
        }
      }),
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
