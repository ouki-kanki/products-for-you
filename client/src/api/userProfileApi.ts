import { RootState } from '../app/store/store';
import { AuthEnum } from './enums';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from './baseConfig';

// TODO: check if this is obsolete
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
    }),
    uploadProfileImage: builder.mutation<{ imageUrl: string }, { formData: FormData, recaptchaToken: string}>({
      queryFn: async ({ formData: formDataPayload, recaptchaToken }, _queryApi, _extraOptions, baseQuery) => {
        return await baseQuery({
          url: 'user-control/profile/upload-image',
          method: 'PATCH',
          body: formDataPayload as FormData,
          headers: {
            'X-Recaptcha-Token': recaptchaToken
          }
        })
      },
    })
  })
})

export const {
 useCreateUserProfileMutation,
 useUploadProfileImageMutation
} = userProfileApi
