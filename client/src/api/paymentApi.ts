import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthEnum } from "./enums";
import { RootState } from "../app/store/store";
import { BASE_URL } from "./baseConfig";
import { convertSnakeToCamelArray } from "../utils/converters";

import type { IshippingData } from "../types/cartPayments";
import type { ShippingPlan, IShippingCosts } from "../types/cartPayments";


interface IPaymentResponse {
  client_secret: string;
}

interface IPaymentData {
  planId: string;
}

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + 'payment/',
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
    calculateShippingCosts: builder.mutation<IShippingCosts, IshippingData>({
      query: (payload) => ({
        url: 'calculate-shipping-costs',
        method: 'POST',
        body: payload
      }),
      transformResponse: (res) => {
        const plans = [ ...res.plans ]
        const camelPlans = convertSnakeToCamelArray(plans)
        return {
          taxRate: res.tax_rate,
          plans: camelPlans
        }
      }
    }),
    createPaymentIntent: builder.mutation<IPaymentResponse, IPaymentData>({
      query: (payload) => ({
        url: 'create-payment-intent',
        method: 'POST',
        body: payload
      })
    }),
  })
})

export const { useCreatePaymentIntentMutation, useCalculateShippingCostsMutation } = paymentApi
