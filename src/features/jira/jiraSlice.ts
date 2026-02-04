import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jiraApi from "../../api/jiraApi";
import type { SubTaskDTO } from "../../types/jira";

interface JiraState {
  dashboardDetail: DashboardResponse | null;
  ticketSubtaskList: SubTaskDTO[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: JiraState = {
  dashboardDetail: null,
  ticketSubtaskList: null,
  status: "idle",
  error: null,
};

export const fetchReleaseById = createAsyncThunk(
  "jira/fetchDashboardByRelease",
  async (releaseId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await jiraApi.getReleaseById(releaseId);
      return response;
    } catch (err: any) {
      return rejectWithValue(`fetchDashboardByRelease failed: ${err}`);
    }
  },
);

export const fetchTicketDetail = createAsyncThunk(
  "jira/fetchTicketDetail",
  async (key: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await jiraApi.getSubtaskByKey(key);
      return response;
    } catch (err: any) {
      rejectWithValue(`fetchTicketDetail failed: ${err}`);
    }
  },
);

const jiraSlice = createSlice({
  name: "jira",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReleaseById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReleaseById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardDetail = action.payload;
      })
      .addCase(fetchReleaseById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // get ticket detail
      .addCase(fetchTicketDetail.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTicketDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ticketDetail = action.payload || null;
      })
      .addCase(fetchTicketDetail.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      });
  },
});

export default jiraSlice.reducer;
