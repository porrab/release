import { configureStore } from "@reduxjs/toolkit";
import releaseReducer from "../features/jira/jiraSlice";

export const store = configureStore({
  reducer: { releases: releaseReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
