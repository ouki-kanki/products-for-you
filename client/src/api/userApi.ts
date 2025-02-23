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

interface IFavoriteProduct {
  name: string;
}

export type IUserProfile = IUserProfileBase & Record<string, string>

export const userApi = authBaseApi.injectEndpoints({
  endpoints: builder => ({
    getUserProfile: builder.query<IUserProfile, void>({
      query: () => `/user-control/profile/`,
    }),
    updateUserProfile: builder.mutation<void, Partial<IUserProfile>>({
      query: (body) => ({
        url: 'user-control/profile/update',
        method: 'PATCH',
        body
      })
    }),
    getFavoriteProducts: builder.query<IFavoriteProduct[], void>({
      query: () => `user-control/favorite-products`,
    }),
    addFavoriteProduct: builder.mutation<void, { slug: string}>({
      query: (body) => ({
        url: 'user-control/favorite-products/add',
        method: 'POST',
        body
      })
    }),
    deleteFavoriteProduct: builder.mutation<void, { slug: string}>({
      query: (body) => ({
        url: 'user-control/favorite-products/remove',
        method: 'DELETE',
        body
      })
    })
  })
})

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetFavoriteProductsQuery,
  useAddFavoriteProductMutation,
  useDeleteFavoriteProductMutation
} = userApi
