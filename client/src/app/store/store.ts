import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch as useBaseDispatch } from "react-redux";

import { authBaseApi } from "../../api/authBaseApi";
import uiReducer from '../../features/UiFeatures/UiFeaturesSlice';
import cartReducer from '../../features/cart/cartSlice'
import facetRecucer from '../../features/filtering/facetSlice'

import { productsSlice } from "../../features/products/productsSlice";
import authReducer from '../../features/auth/authSlice';
import {
  userApi,
  productsApi,
  orderApi,
  paymentApi,
  userProfileApi,
  cartApi,
  authApiV2,
  searchApi } from "../../api";

import { cartMiddleware, cartListenerMiddleware } from "./middleware/cartMiddleware";

// TODO: getDefaultMiddleware is deprecated
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    cart: cartReducer,
    filters: facetRecucer,
    [productsSlice.reducerPath]: productsSlice.reducer,

    // this is the old api
    [authBaseApi.reducerPath]: authBaseApi.reducer,
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApiV2.reducerPath]: authApiV2.reducer,
    [userProfileApi.reducerPath]: userProfileApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().prepend(
      cartListenerMiddleware.middleware
    )
    .concat([
      productsSlice.middleware,
      authBaseApi.middleware,
      authApiV2.middleware,
      userApi.middleware,
      userProfileApi.middleware,
      productsApi.middleware,
      orderApi.middleware,
      searchApi.middleware,
      cartApi.middleware,
      cartMiddleware,
      paymentApi.middleware
    ])
  )
})

setupListeners(store.dispatch)


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const selectUsers = (state: RootState) => state.users
export const useAppDispatch = (): AppDispatch => useBaseDispatch()
