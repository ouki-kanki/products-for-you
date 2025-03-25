import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { showNotification } from '../components/Notifications/showNotification';
import { baseQueryWithReauth } from './authBaseApi';
import type { ICart } from '../types/cartPayments';

export interface ICartProduct {
  product_item: string;
  price: number;
  quantity: number;
}

interface Address {
  city: string;
  shippingAddress: string;
  state: string;
  postalCode: string;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: Address
}

interface Order {
  cart: ICart;
  paymentId: string;
  userDetails: UserDetails
}

interface OrderResponse {

}

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponse, Order>({
      query: (payload) => ({
        url: '/orders/create',
        method: 'POST',
        body: payload,
        headers: {}
      }),
      transformResponse: (res) => {
        console.log("create order res from api",res)
        showNotification({
          message: 'order created'
        })
      }
    })
  })
})

export const { useCreateOrderMutation, } = orderApi
