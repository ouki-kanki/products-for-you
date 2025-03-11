import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { showNotification } from '../components/Notifications/showNotification';
import { baseQueryWithReauth } from './authBaseApi';

export interface ICartProduct {
  product_item: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  user_id: string;
  ref_code: string;
  phoneNumber: string;
  shipping_address: string;
  billing_address: string;
  order_total: number;
  refund_status: string,
  order_item: ICartProduct[]
}

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createOrder: builder.mutation<Record | void, IOrder>({
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
