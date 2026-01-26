import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import authReducer from "@/lib/authSlice"; // 👈 DEFAULT import (FIX)

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
