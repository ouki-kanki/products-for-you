import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authBaseApi";
import { AuthEnum } from "./enums";
import { RootState } from "../app/store/store";
import { BASE_URL } from "./baseConfig";
import type { CartItemForServer } from "../types/cartPayments";
import type { ICart } from "../types/cartPayments";

interface ICartResponse {
  message: string;
}

interface SessionCart {
  items: CartItemForServer[];
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
    credentials: 'include'
  }),
  endpoints: (builder) => ({
    createCart: builder.mutation<ICartResponse, CartItemForServer[]>({
      query: (payload) => ({
        url: 'add',
        method: 'POST',
        body: payload
      })
    }),
    createSessionCart: builder.mutation<ICartResponse, SessionCart>({
      query: (payload) => ({
        url: 'add-session-cart',
        method: 'POST',
        body: payload
      })
    }),
    getSessionCart: builder.query<ICart, void>({
      query: () => ({
        url: 'get-session-cart'
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
