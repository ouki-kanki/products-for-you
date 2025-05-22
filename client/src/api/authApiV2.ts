import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./baseConfig";
import { AuthEnum } from "./enums";
import { LogoutData } from "./types";
import { userApi } from "./userApi";
import { clearCredentials } from "../features/auth/authSlice";

export const authApiV2 = createApi({
  reducerPath: 'authApiV2',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include'
  }),
  endpoints: (builder) => ({
    /**\
     * refhesh is set on cookie.
     * cookie is httpOnly it will be cleared in the server
     */
    logout: builder.mutation<LogoutData, void>({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST'
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled

          // clear the user profile from cache
          // dispatch(userApi.util.resetApiState())

          // clear the user creds
          dispatch(clearCredentials)

          window.location.replace(`/login?redirect=${window.location.pathname}`)
        } catch (error) {
          console.log("the error in logout", error)
        }
      }
    })
  })
})

export const {
  useLogoutMutation
} = authApiV2
