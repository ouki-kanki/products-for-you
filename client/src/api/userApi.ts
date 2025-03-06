import { authBaseApi } from './authBaseApi';
import { convertSnakeToCamelV2, convertSnakeToCamel } from '../utils/converters';
import type { Iorder } from './types';

export interface IUserProfileBase {
  firstName: string;
  lastName: string;
  email: string;
  addressOne: string;
  addressTwo: string;
  postCode: string;
  city: string;
  country: string;
  image: string;
}

interface IFavoriteProduct {
  name: string;
}

export interface IorderPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  num_of_pages: number;
  results: Array<Iorder>
}

type orderParams = {
  page?: number;
  page_size?: number;
}

export type IUserProfile = IUserProfileBase & Record<string, string>

export const userApi = authBaseApi.injectEndpoints({
  endpoints: builder => ({
    getUserProfile: builder.query<IUserProfile, void>({
      query: () => `/user-control/profile/`,
      transformResponse: (response, meta, arg) => {
          return convertSnakeToCamelV2(response)
      },
    }),
    updateUserProfile: builder.mutation<void, Partial<IUserProfile>>({
      query: (body) => ({
        url: 'user-control/profile/update',
        method: 'PATCH',
        body
      })
    }),
    getOrders: builder.query<Iorder, orderParams>({
      query: ({ page = 1, page_size = 10 } = {}) => ({
        url: 'user-control/orders',
        params: {
          page,
          page_size
        }
      }),
      transformResponse: (res: IorderPaginatedResponse) => {
        // TODO: this mutates the response. change the method to not do this inplace
        convertSnakeToCamel(res)
        return res
      }
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
  useDeleteFavoriteProductMutation,
  useGetOrdersQuery
} = userApi
