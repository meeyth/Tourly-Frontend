import { baseApi } from "./baseApi";

export const registerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postUserRegister: builder.mutation({
      query: (formData) => ({
        url: "/users/register",
        method: "POST",
        body: formData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { usePostUserRegisterMutation } = registerApi;
