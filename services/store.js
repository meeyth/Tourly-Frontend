import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/features/auth/baseApi"; // ✅ the shared base API
import { setupListeners } from "@reduxjs/toolkit/query";

// (Optional) if you later add other slices:
// import authReducer from "@/features/auth/authSlice";

export const store = configureStore({
  reducer: {
    // RTK Query reducer for all APIs that use baseApi
    [baseApi.reducerPath]: baseApi.reducer,

    // ✅ add other slices here
    // auth: authReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Optional — enables refetchOnFocus / refetchOnReconnect behaviors
setupListeners(store.dispatch);
