"use client";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

//call the refresh token function on every page load
export const initializeApp = async () => {
  try {
    await Promise.all([
      store.dispatch(apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })),
      store.dispatch(apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }))
    ]);
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
};

initializeApp();
