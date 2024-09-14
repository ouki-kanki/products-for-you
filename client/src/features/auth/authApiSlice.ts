import { apiSlice } from "../../api/apiSlice";

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
  })
})


export const {
  useLoginMutation
} = authApiSlice
