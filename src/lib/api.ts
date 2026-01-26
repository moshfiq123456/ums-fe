import { RootState } from "@/store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    getUserById: builder.query<any, string>({ // <--- new endpoint
      query: (userId) => `/users/${userId}`,
    }),

    getUsers: builder.query<any, void>({
      query: () => "/users?page=1&size=2",
    }),
    refreshToken: builder.mutation<{ access_token: string }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        credentials: "include", // VERY IMPORTANT (for cookies)
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include", // 🔑 sends refresh cookie
      }),
    }),

    
  }),
});

export const {
  useLoginMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useLogoutMutation,
} = api;

