import { AuthEnum } from './enums';
import type { RootState } from '../app/store/store';
// import type { Headers } from '@reduxjs/toolkit/query/react'

// TODO: how to fix the type error for getState .typescript needs stop complaining
export const prepareHeaders =  (headers: Headers, { getState }) => {
  const token = (getState() as RootState).auth.token
  if (token) {
    headers.set(AuthEnum.authorization, `Bearer ${token}`)
  }
  return headers
}