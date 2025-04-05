import { authBaseApi } from "./authBaseApi";
import { setCredentials } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

export interface LoginCreds {
  email: string;
  password: string
}

interface JwtPayload {
  username: string;
  user_id: number;
  uuid: string;
}

interface LogoutData {
  message: string;
}

interface RegisterData {
  username?: string;
  email: string;
  password: string;
  password2: string;
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
      query: ({ email, password }: LoginCreds) => ({
        url: '/auth/token/',
        method: 'POST',
        body: {
          email,
          password
        }
      })
    }),
    // cookie is http, clear it on the server
    logout: builder.mutation<LogoutData, void>({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST'
      })
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
            uuid,
            accessToken: access,
          }))

        } catch (error) {
          // console.log(error)
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
      query: (uidb64) => ({
        url: `auth/activate-user/${uidb64}`
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
  useRefreshMutation,
  useLogoutMutation,
  useRegisterMutation,
  useLazyActivateUserQuery,
  useLazyResendEmailQuery,
} = authApi
