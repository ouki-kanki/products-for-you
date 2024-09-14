import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../api/baseConfig';
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
   }),
  endpoints: (builder) => ({
    getProfile: builder.query<IUserProfile, string>({
      query: (userId) => ({
        url: `/user-control/profile/${userId}`,
      })
    })
  })
})

export const { useGetProfileQuery, useLazyGetProfileQuery } = userApi
