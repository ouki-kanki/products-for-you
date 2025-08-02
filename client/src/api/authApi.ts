import { authBaseApi } from "./authBaseApi";
import { setCredentials } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { clearCredentials } from "../features/auth/authSlice";
import type { LogoutData } from "./types";

export interface LoginCreds {
  email: string;
  password: string;
  recaptchaToken: string | null;
}

interface JwtPayload {
  username: string;
  user_id: number;
  uuid: string;
}

interface RegisterData {
  username?: string;
  email: string;
  password: string;
  password2: string;
  recaptchaToken: string;
}

interface RegisterReturnData {
  email: string;
  username: string;
  role: string;
  uid: string;
}

export const authApi = authBaseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: ({ email, password, recaptchaToken }: LoginCreds) => ({
        url: '/auth/token/',
        method: 'POST',
        body: {
          email,
          password,
          recaptchaToken
        }
      })
    }),
    loginDemo: builder.mutation({
      query: ({ recaptchaToken }) => ({
        url: '/auth/token/demo',
        method: 'POST',
        body: {
          recaptchaToken
        }
      })
    }),
    // cookie is http, clear it on the server
    logout: builder.mutation<LogoutData, void>({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST'
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(clearCredentials()) // clears the user state
          // dispatch(userApi.util.resetApiState())
        } catch (error) {
          console.error(error)
        }
      }
    }),
    // TODO: similar logic inside baseQuery
    // this is used to persist data on reload the other mutation gets user creds from store
    refresh: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/token/refresh/',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data: { access }} = await queryFulfilled
          const { username: user, uuid } = jwtDecode<JwtPayload>(access)

          dispatch(setCredentials({
            user,
            userId: uuid,
            accessToken: access,
          }))

        } catch (error) {
          console.log("inside the api error")
          // if refresh exprired logout the user
          dispatch(authApi.endpoints.logout.initiate())
        }
      }
    }),
    register: builder.mutation<RegisterReturnData, RegisterData>({
      query: ({
        ...args
      }) => ({
        url: 'auth/register/',
        method: 'POST',
        body: {
          ...args
        }
      }),
    }),
    activateUser: builder.query<void, string>({
      query: (token) => ({
        url: `auth/activate-user?token=${token}`
      })
    }),
    resendEmail: builder.query<void, string>({
      query: (uid) => ({
        url: `auth/resend-email/${uid}`
      })
    })
  })
})

export const {
  useLoginMutation,
  useLoginDemoMutation,
  useRefreshMutation,
  useLogoutMutation,
  useRegisterMutation,
  useLazyActivateUserQuery,
  useLazyResendEmailQuery,
  useActivateUserQuery
} = authApi
