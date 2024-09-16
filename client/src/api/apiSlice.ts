import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react'
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
    // headers.set("Referrer-Policy", "unsafe-url")
    // headers.set('Content-Type', 'application/json')

    return headers
  },
  credentials: 'include',
})

// TODO: get and send refresh with cookies
export const refreshBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  method: 'POST',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userTokens.refreshToken
    if (token) {
      headers.set(AuthEnum.authorization, `Bearer ${token}`)
    }

    return headers
  }
})


const baseQueryWithReauth = async (args: Args, api: BaseQueryApi, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403 || result?.error?.status === 401) {
    // if access is expired fetch new access and refresh tokens
    const refreshToken = (api.getState() as RootState).auth.userTokens.refreshToken
    const refreshResult = await refreshBaseQuery({
                                        url: '/auth/token/refresh/',
                                        body: { refresh: refreshToken }},
                                        { ...api, type: 'mutation', },
                                        extraOptions, )

    if (refreshResult?.data) {
      const user = (api.getState() as RootState).auth.userInfo.user
      const userId = (api.getState() as RootState).auth.userInfo.user_id

      // TODO: correct types
      // set the new access and refresh tokens
      const { access, refresh } = refreshResult.data
      api.dispatch(setCredentials({
        user,
        userId: userId,
        accessToken: access,
        refreshToken: refresh
      }))

      // retry with new access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logOut())
    }

  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({})
})
