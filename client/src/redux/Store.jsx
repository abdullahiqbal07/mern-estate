import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./user/UserSlice";

export const store = configureStore({
  reducer: {
    user: UserSlice,
  },
  middleware: (getDefaultMiddleware) => 
    // Ensure you're returning the result of the call to getDefaultMiddleware
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
