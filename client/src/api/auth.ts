import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../api/baseConfig';


export interface ILoginRequest {
  username: string;
  password: string;
}

// TODO: have to omit email and created from here
// remove from the serializer 
export interface UserResponse {
  user_id: number,
  token: string,
  email: string,
  created: boolean
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse | void, ILoginRequest>({
      query: (payload) => ({  
        url: '/users/token-auth',
        method: 'POST',
        body: payload,
        headers: {
        }
      }),
      // transformErrorResponse: (
        // response: {{ status, data }:IServerErrorV2},
        // meta,
        // arg 
      // ) =>       
    })
  })
})

export const { useLoginMutation } = authApi