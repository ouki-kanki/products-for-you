import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authBaseApi";
import { AuthEnum } from "./enums";
import { RootState } from "../app/store/store";
import { BASE_URL } from "./baseConfig";

interface ICartResponse {
  message: string;
}

// TODO: check if the type exists
interface ICartItem {
  price: string;
  product_item: number;
  quantity: number;

}

interface ICart {
  cart_item: ICartItem[];
  total: number;
}

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + 'cart/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.userTokens.accessToken
      if (token) {
        headers.set(AuthEnum.authorization, `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    createCart: builder.mutation<ICartResponse, ICartItem[]>({
      query: (payload) => ({
        url: 'add',
        method: 'POST',
        body: payload
      })
    }),
    getCart: builder.query<ICart, string>({
      query: (user_id) => ({
        url: `${user_id}`
      })
    }),
    deleteCart: builder.mutation<ICartResponse, void>({
      query: () => ({
        url: 'delete',
        method: 'DELETE'
      })
    })
  })
})

export const { useDeleteCartMutation } = cartApi
