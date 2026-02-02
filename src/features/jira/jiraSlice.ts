import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jiraApi from "../../api/jiraApi";
import type { DashboardResponse, JiraReleaseInfo } from "../../types/jira";

export const fetchReleases = createAsyncThunk(
  "jira/fetchReleases",
  async (_, { rejectWithValue }) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await jiraApi.getAllReleases();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(`fetchReleases failed: ${err}`);
    }
  },
);

export const fetchDashboardByRelease = createAsyncThunk(
  "/jira/fetchDashboardByRelease",
  async (releaseId: string, { rejectWithValue }) => {
    try {
      const response = await jiraApi.getDashboardByReleaseId(releaseId);
      return response;
    } catch (err: any) {
      return rejectWithValue(`fetchReleasesById failed: ${err}`);
    }
  },
);

export interface JiraState {
  releaseList: JiraReleaseInfo[];
  dashboardDetail: DashboardResponse | null;

  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: JiraState = {
  releaseList: [],
  dashboardDetail: null,
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
        state.releaseList = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchReleases.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // fetch release by id
      .addCase(fetchDashboardByRelease.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardByRelease.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardDetail = action.payload;
      })
      .addCase(fetchDashboardByRelease.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

const releaseReducer = releaseSlice.reducer;
export default releaseReducer;
