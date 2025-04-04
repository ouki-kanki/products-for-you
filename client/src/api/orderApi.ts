import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { showNotification } from '../components/Notifications/showNotification';
import { baseQueryWithReauth } from './authBaseApi';

interface CartItem {
  price: string;
  productId: string;
  quantity: number;
}

interface CartOrder {
  isSynced: boolean;
  isUpdating: boolean;
  items: CartItem[];
}

interface AddressOrder {
  shippingAddress: string;
  billingAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface UserDetailsOrder {
  userId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  extraShippingDetails?: string;
  address: AddressOrder
}

interface Order {
  cart: CartOrder;
  paymentId: string;
  shippingPlanId: string;
  userDetails: UserDetailsOrder;
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
    })
  })
})

export const { useCreateOrderMutation, } = orderApi
