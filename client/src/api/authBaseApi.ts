import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BaseQueryApi } from '@reduxjs/toolkit/query/react'
import { setCredentials, clearCredentials } from '../features/auth/authSlice'

import { BASE_URL } from './baseConfig'
import { AuthEnum } from './enums'
import type { RootState } from '../app/store/store'
import { jwtDecode } from 'jwt-decode'

import { authApiV2 } from './authApiV2'

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
export const refreshBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  method: 'POST',
  credentials: 'include'
})

export const baseQueryWithReauth = async (args: Args, api: BaseQueryApi, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  console.log("inside the base query", result)

  if (result?.error?.status === 403 || result?.error?.status === 401) {
    // if access is expired fetch new access and refresh tokens
    // document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    const refreshResult = await refreshBaseQuery({
                                        url: '/auth/token/refresh/',},
                                        { ...api, type: 'mutation', },
                                        extraOptions, )

    console.log("refresh result", refreshResult)
    if (refreshResult?.data) {
      const user = (api.getState() as RootState).auth.userInfo.user as string
      const userId = (api.getState() as RootState).auth.userInfo.user_id
      const { access } = refreshResult.data as { access: string }

      const decoded = jwtDecode(access)
      const exp = decoded.exp * 1000
      console.log("token exp", new Date(exp).toLocaleString())


      api.dispatch(setCredentials({
        user,
        userId: userId,
        accessToken: access,
      }))

      // retry with new access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      console.log("refresh expired logout")
      // api.dispatch(authApiV2.endpoints.logout.initiate())
    }

  }
  return result
}

export const authBaseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({})
})
