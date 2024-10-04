import { authBaseApi } from './authBaseApi';

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


export const userApi = authBaseApi.injectEndpoints({
  endpoints: builder => ({
    getUserProfile: builder.query<IUserProfile, void>({
      // query: (userId) => `/user-control/profile/${userId}`,
      query: () => `/user-control/profile/`,
      keepUnusedDataFor: 5,
    })
  })
})

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
} = userApi
