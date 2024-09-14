import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../features/auth/authSlice'

import { BASE_URL } from './baseConfig'
import { AuthEnum } from './enums'
import type { RootState } from '../app/store/store'


const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  // credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userTokens.accessToken
    if (token) {
      headers.set(AuthEnum.authorization, `Bearer ${token}`)
    }
    // headers.set("Referrer-Policy", "unsafe-url")
    return headers
  }
})


const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.originalStatus === 403) { // token has expired
    console.log('sending refresh token')

    // hit refresh user to get a new access and refresh token
    const refreshResult = await baseQuery('auth/token/refresh/', api, extraOptions)
    console.log("refresh token reslut", refreshResult)

    if (refreshResult?.data) {
      const user = api.getState().auth.userInfo.name
      // set the new access and refresh tokens
      api.dispatch(setCredentials({
        user,
        accessToken: data?.access,
        refreshToken: data?.refresh
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
