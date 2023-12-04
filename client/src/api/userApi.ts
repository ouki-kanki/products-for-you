import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../api/baseConfig';
import type { RootState } from '../app/store';
import { AuthEnum } from './enums';
import { prepareHeaders } from './common';

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
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders
    // prepareHeaders: (headers, { getState }) => {
    //   const token = (getState() as RootState).auth.token
    //   if (token) {
    //     headers.set(AuthEnum.authorization, `Bearer ${token}`)
    //   }      
    //   return headers
    // }
   }),
  endpoints: (builder) => ({
    getProfile: builder.query<IUserProfile, string>({
      query: (userId) => ({
        url: `/users/profile/${userId}`,
        // method: 'GET',
      })
    })
  })
})

export const { useGetProfileQuery, useLazyGetProfileQuery } = userApi