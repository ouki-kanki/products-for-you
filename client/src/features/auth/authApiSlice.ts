import { apiSlice } from "../../api/apiSlice";
import { RootState } from "../../app/store/store";
import { setCredentials } from "./authSlice";

export interface LoginCreds {
  email: string;
  password: string
}


export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: ({ email, password }: LoginCreds) => ({
        url: '/auth/token/',
        method: 'POST',
        body: {
          email,
          password
        }
      })
    }),
    // TODO: similar logic inside baseQuery
    refresh: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/token/refresh/',
        method: 'POST',
        body: {
          refresh: refreshToken
        }
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data: { access, refresh }} = await queryFulfilled
          const user = (getState() as RootState).auth.userInfo.user as string
          const userId = (getState() as RootState).auth.userInfo.user_id

          console.log("access, refresh inside refresh mut", access, refresh)
          dispatch(setCredentials({
            user,
            userId,
            accessToken: access,
            refreshToken: refresh
          }))

        } catch (error) {
          console.log(error)
          // TODO: show notification
        }
      }
    })
  })
})


export const {
  useLoginMutation,
  useRefreshMutation,
} = authApiSlice
