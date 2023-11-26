import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import usersReducer from '../features/users/usersSlice';
import uiReducer from '../features/UiFeatures/UiFeaturesSlice';

import { productsSlice } from "../features/products/productsSlice";
import authReducer from '../features/auth/Login/loginSlice';
import userReducer from '../features/users/userSliceV2';
import { authApi, userApi } from "../api";

// TODO: getDefaultMiddleware is deprecated
export const store = configureStore({
  reducer: {
    users: usersReducer,
    ui: uiReducer,
    [productsSlice.reducerPath]: productsSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat([
      productsSlice.middleware,
      authApi.middleware,
      userApi.middleware
    ])
  )
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const selectUsers = (state: RootState) => state.users