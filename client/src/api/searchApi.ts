import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./baseConfig";


export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL
  }),
  endpoints: (builder) => ({
    searchProductItem: builder.query({
      query: (query) => ({
          url: `search/productitems/`,
          params: {
            search: query
        }
      }),
      transformResponse: (response, meta, arg) => {
        return response
      },
      transformErrorResponse: (response: { status: string | number }, meta, arg) => response.status
    })
  })
})


export const {
  useSearchProductItemQuery
} = searchApi
