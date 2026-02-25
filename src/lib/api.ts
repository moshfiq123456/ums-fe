import { RootState } from "@/store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ─── Types ────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  createdAt?: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  size: number;
}

export interface GetUsersParams {
  page?: number;
  size?: number;
}

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Users"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body,credentials: "include" }),
    }),

    getUserById: builder.query<any, string>({
      query: (id) => `/users/${id}`,
    }),

    getUsers: builder.query<UsersResponse, GetUsersParams>({
      query: ({ page = 1, size = 10 } = {}) =>
        `/users?page=${page}&size=${size}`,
      providesTags: ["Users"],
      
    }),

    refreshToken: builder.mutation<{ access_token: string }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        credentials: "include",
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
    }),

    updateUser: builder.mutation<any, any>({
      query: (body) => ({
        url: `/users/${body.id}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserByIdQuery,
  useGetUsersQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useUpdateUserMutation,
} = api;
