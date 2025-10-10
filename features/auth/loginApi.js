import { baseApi } from "./baseApi";

export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postUserLogin: builder.mutation({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { usePostUserLoginMutation } = loginApi;
