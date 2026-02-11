import { configureStore } from "@reduxjs/toolkit";
import releaseReducer from "../features/releaseSlice/releaseSlice";

export const store = configureStore({
  reducer: { releases: releaseReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
