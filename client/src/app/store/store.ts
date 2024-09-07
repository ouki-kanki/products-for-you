import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { useDispatch as useBaseDispatch } from "react-redux";
import usersReducer from '../../features/users/usersSlice';
import uiReducer from '../../features/UiFeatures/UiFeaturesSlice';
import cartReducer from '../../features/cart/cartSlice'
import facetRecucer from '../../features/filtering/facetSlice'

import { productsSlice } from "../../features/products/productsSlice";
import authReducer from '../../features/auth/Login/loginSlice';
import userReducer from '../../features/users/userSliceV2';
import { authApi, userApi, productsApi, orderApi, searchApi } from "../../api";

import { cartMiddleware, cartListenerMiddleware } from "./middleware/cartMiddleware";

// TODO: getDefaultMiddleware is deprecated
export const store = configureStore({
  reducer: {
    users: usersReducer,
    ui: uiReducer,
    cart: cartReducer,
    filters: facetRecucer,
    [productsSlice.reducerPath]: productsSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    user: userReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    // [facetSlice.red]
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().prepend(
      cartListenerMiddleware.middleware
    )
    .concat([
      productsSlice.middleware,
      authApi.middleware,
      userApi.middleware,
      productsApi.middleware,
      orderApi.middleware,
      searchApi.middleware,
      cartMiddleware
    ])
  )
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const selectUsers = (state: RootState) => state.users
export const useAppDispatch = (): AppDispatch => useBaseDispatch()
