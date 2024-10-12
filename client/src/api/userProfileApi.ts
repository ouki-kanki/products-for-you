import { RootState } from '../app/store/store';
import { AuthEnum } from './enums';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from './baseConfig';

export const userProfileApi = createApi({
  reducerPath: 'userProfile',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.userTokens.accessToken
      if (token) {
        headers.set(AuthEnum.authorization, `Bearer ${token}`)
        // headers.set('Content-Type', 'multipart/form-data')
      }
      return headers
    }
  }),
  endpoints: (builder) => ({
    createUserProfile: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: 'user-control/profile/insert',
        method: 'POST',
        body: formData as FormData,
        formData: true
      })
    })
  })
})


export const {
 useCreateUserProfileMutation
} = userProfileApi
