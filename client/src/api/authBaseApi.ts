import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BaseQueryApi } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../features/auth/authSlice'

import { BASE_URL } from './baseConfig'
import { AuthEnum } from './enums'
import type { RootState } from '../app/store/store'


const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userTokens.accessToken
    if (token) {
      headers.set(AuthEnum.authorization, `Bearer ${token}`)
    }
    return headers
  },
  credentials: 'include',
})

// TODO: get and send refresh with cookies
// TODO: if refresh is send through cookies this is obsolete
export const refreshBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  method: 'POST',
  credentials: 'include'
})


export const baseQueryWithReauth = async (args: Args, api: BaseQueryApi, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403 || result?.error?.status === 401) {
    // if access is expired fetch new access and refresh tokens
    const refreshResult = await refreshBaseQuery({
                                        url: '/auth/token/refresh/',},
                                        { ...api, type: 'mutation', },
                                        extraOptions, )

    if (refreshResult?.data) {
      const user = (api.getState() as RootState).auth.userInfo.user as string
      const userId = (api.getState() as RootState).auth.userInfo.user_id
      const { access } = refreshResult.data as { access: string }
      api.dispatch(setCredentials({
        user,
        userId: userId,
        accessToken: access,
      }))

      // retry with new access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logOut())
    }

  }
  return result
}

export const authBaseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({})
})
