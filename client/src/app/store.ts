import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import usersReducer from '../features/users/usersSlice';

import { productsSlice } from "../features/products/productsSlice";

// TODO: getDefaultMiddleware is deprecated
export const store = configureStore({
  reducer: {
    users: usersReducer,
    [productsSlice.reducerPath]: productsSlice.reducer
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat([
      productsSlice.middleware
    ])
  )
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const selectUsers = (state: RootState) => state.users