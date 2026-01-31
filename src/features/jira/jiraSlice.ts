import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jiraApi from "../../api/jiraApi";
import type { JiraRelease } from "../../types/jira";

export const fetchReleases = createAsyncThunk(
  "jira/fetchReleases",
  async (_, { rejectWithValue }) => {
    try {
      const response = await jiraApi.getRelease();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(`fetchReleases failed: ${err}`);
    }
  },
);

export const fetchReleaseById = createAsyncThunk(
  "/jira/fetchReleaseById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await jiraApi.getReleaseById(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(`fetchReleasesById failed: ${err}`);
    }
  },
);

export interface ReleaseState {
  data: JiraRelease[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReleaseState = {
  data: [],
  status: "idle",
  error: null,
};

export const releaseSlice = createSlice({
  name: "releases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch release
    builder
      .addCase(fetchReleases.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReleases.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchReleases.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // fetch release by id
      .addCase(fetchReleaseById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReleaseById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const release = action.payload;
        const index = state.data.findIndex((r) => r.id === release.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        } else {
          state.data.push(action.payload);
        }
      })
      .addCase(fetchReleaseById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

const releaseReducer = releaseSlice.reducer;
export default releaseReducer;
