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
  useUpdateUserProfileMutation
} = userApi
