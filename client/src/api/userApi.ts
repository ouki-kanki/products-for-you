import { authBaseApi } from './authBaseApi';

export interface IUserProfileBase {
  firstName: string;
  lastName: string;
  email: string;
  addressOne: string;
  addressTwo: string;
  city: string;
  country: string;
  image: string;
}

export type IUserProfile = IUserProfileBase & Record<string, string>

export const userApi = authBaseApi.injectEndpoints({
  endpoints: builder => ({
    getUserProfile: builder.query<IUserProfile, void>({
      // query: (userId) => `/user-control/profile/${userId}`,
      query: () => `/user-control/profile/`,
      keepUnusedDataFor: 5,
    }),
    // *** OBSOLETE **
    // userProfile api is used in favor of this . this is using authBase.authBase is preparing the content-type. i couldn't find a way to modify the content header
    // seems that prepareHeaders is called last in the chain
    submitUserProfile: builder.mutation<void, FormData>({
      query: (formdata: FormData) => ({
        url: 'user-control/profile/insert',
        method: 'POST',
        headers: {
          'content-type': ''
          // 'content-Type': 'multipart/form-data'
        },
        body: formdata as FormData,
        formData: true,
      })
    }),
    updateUserProfile: builder.mutation<void, Partial<IUserProfile>>({
      query: (body) => ({
        url: 'user-control/profile/update',
        method: 'PATCH',
        body
      })
    })
  })
})

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useSubmitUserProfileMutation,
  useUpdateUserProfileMutation
} = userApi
