import { apiSlice } from "../../api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
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
