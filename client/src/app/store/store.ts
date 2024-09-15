import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch as useBaseDispatch } from "react-redux";

import { apiSlice } from "../../api/apiSlice";
import usersReducer from '../../features/users/usersSlice_old';
import uiReducer from '../../features/UiFeatures/UiFeaturesSlice';
import cartReducer from '../../features/cart/cartSlice'
import facetRecucer from '../../features/filtering/facetSlice'

import { productsSlice } from "../../features/products/productsSlice";
import authReducer from '../../features/auth/authSlice';
import userReducer from '../../features/users/userSliceV2';
import {
  authApi,
  userApi,
  productsApi,
  orderApi,
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
    // [authApi.reducerPath]: authApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    user: userReducer,
    users: usersReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().prepend(
      cartListenerMiddleware.middleware
    )
    .concat([
      productsSlice.middleware,
      apiSlice.middleware,
      // authApi.middleware,
      userApi.middleware,
      productsApi.middleware,
      orderApi.middleware,
      searchApi.middleware,
      cartMiddleware
    ])
  )
})

setupListeners(store.dispatch)


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const selectUsers = (state: RootState) => state.users
export const useAppDispatch = (): AppDispatch => useBaseDispatch()
