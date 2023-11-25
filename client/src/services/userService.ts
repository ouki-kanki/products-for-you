import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../api/baseConfig';
import type { RootState } from '../app/store';


export interface IUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  addressOne: string;
  addressTwo?: string;
  city?: string;
  country?: string;
  image: string;
}


export const userApi = createApi({
  reducerPath: 'user',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }      
      return headers
    }
   }),
  endpoints: (builder) => ({
    getUserProfile: builder.query<IUserProfile[], void>({
      query: (userId) => ({
        url: `/users/profile/${userId}`,
        method: 'GET'
      })
    })
  })
})

export const { useGetUserProfileQuery, useLazyGetUserProfileQuery } = userApi