import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./baseConfig";

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

export type Facet = [string, number, boolean]
export interface Facets {
  [key: string]: Facet,
}

interface ListResponse<T> {
  next: string | null;
  prev: string | null;
  total_items: number;
  num_of_pages: number;
  per_page: number;
  results: T[];
  'facets[]': Facets;
}

type QueryParams = {
  query: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  facets?: string;
  // facets: Record<string, string>
}

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // paramsSerializer
  }),
  endpoints: (builder) => ({
    searchProductItem: builder.query<ListResponse<SearchProductItem>, QueryParams>({
      query: ({
        query,
        page,
        page_size,
        sort_by,
        facets
      }) => ({
          url: `search/product-items/?${facets}`,
          // cache: false,
          params: {
            search: query,
            page,
            page_size,
            sort_by,
            // ...facets
        }
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        const { query, page, page_size, sort_by, facets } = queryArgs
        return { query, page, page_size, sort_by, facets }
      },
      onQueryStarted: (q) => {
        console.log("--- SEARCH-QUERY TRIGGERED ---")

      },
      transformResponse: (response) => {
        // changes response.facets: { facetName: [['name', 'count', 'active']]}
        // to: { facetName: [{ name: name, count: count, isActive: active }]}
        const facetsObj = { ...response.facets }
        const namesForFields = ['name', 'count', 'isActive']

        const transformedFacets = Object.keys(facetsObj).reduce((ac, key) => {
          const trasformedArrayOfFacets = facetsObj[key].map(arrOfval => {
            return arrOfval.reduce((ac, item: string, index: number) => {
              return { ...ac, [namesForFields[index]]: item }
            }, {})
          })
          return { ...ac, [key]: trasformedArrayOfFacets }
        }, {})

        const transformedResponse = { ...response, facets: transformedFacets}
        return transformedResponse
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
        return response
      }
    })
  })
})


export const {
  useSearchProductItemQuery,
  useLazySearchProductItemQuery,
  useLazySugestProductNameQuery
} = searchApi
