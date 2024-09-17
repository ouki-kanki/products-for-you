import { authBaseApi } from "../../api/authBaseApi";

export const usersApiSlice = authBaseApi.injectEndpoints({
  endpoints: builder => ({
    getUser: builder.query({
      query: (userId) => `/user-control/profile/${userId}`,
      keepUnusedDataFor: 5,
    })
  })
})

export const {
  useGetUserQuery
} = usersApiSlice
