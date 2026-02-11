import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jiraApi from "../../api/jiraApi";
import type { SubTaskDTO, PagedTickets, ReleaseGroup } from "../../types/jira";

interface JiraState {
  allReleases: ReleaseGroup[];
  dashboardDetail: PagedTickets | null;
  ticketSubtaskList: SubTaskDTO[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoadingMore: boolean;
  error: string | null;
}
const initialState: JiraState = {
  allReleases: [],
  dashboardDetail: null,
  ticketSubtaskList: null,
  status: "idle",
  isLoadingMore: false,
  error: null,
};

export const fetchAllReleases = createAsyncThunk<
  ReleaseGroup[],
  void,
  { rejectValue: string }
>("jira/fetchAllReleases", async (_, { rejectWithValue }) => {
  try {
    const response = await jiraApi.getAllRelease();
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message as string);
  }
});

export const fetchReleaseById = createAsyncThunk(
  "jira/fetchDashboardByRelease",
  async (
    args: { releaseId: string; nextPageToken?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await jiraApi.fetchTicketsPage(
        args.releaseId,
        args.nextPageToken ? { nextPageToken: args.nextPageToken } : undefined,
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchTicketDetail = createAsyncThunk(
  "jira/fetchTicketDetail",
  async (key: string, { rejectWithValue }) => {
    try {
      const response = await jiraApi.getSubtaskByKey(key);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateCurrentRelease = createAsyncThunk(
  "jira/updateCurrentRelease",
  async (_, { rejectWithValue }) => {
    try {
      await jiraApi.updateCurrentRelease();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const jiraSlice = createSlice({
  name: "jira",
  initialState,
  reducers: {
    clearTicketSubtask: (state) => {
      state.ticketSubtaskList = null;
    },
    setAllReleases: (state, action: { payload: ReleaseGroup[] }) => {
      state.allReleases = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllReleases
      .addCase(fetchAllReleases.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllReleases.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.allReleases = action.payload || [];
      })
      .addCase(fetchAllReleases.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load releases";
      })

      //  fetchReleaseById
      .addCase(fetchReleaseById.pending, (state, action) => {
        if (action.meta.arg.nextPageToken) {
          state.isLoadingMore = true;
        } else {
          state.status = "loading";
        }
        state.error = null;
      })
      .addCase(fetchReleaseById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoadingMore = false;

        if (action.meta.arg.nextPageToken && state.dashboardDetail) {
          state.dashboardDetail.tickets = [
            ...state.dashboardDetail.tickets,
            ...(action.payload.tickets || []),
          ];
          state.dashboardDetail.nextPageToken = action.payload.nextPageToken;
        } else {
          state.dashboardDetail = action.payload || null;
        }
      })
      .addCase(fetchReleaseById.rejected, (state, action) => {
        if (!action.meta.arg.nextPageToken) {
          state.status = "failed";
        }
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })

      //  fetchTicketDetail
      .addCase(fetchTicketDetail.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTicketDetail.fulfilled, (state, action) => {
        state.ticketSubtaskList = action.payload || null;
      })
      .addCase(fetchTicketDetail.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // update release from jira
      .addCase(updateCurrentRelease.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCurrentRelease.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(updateCurrentRelease.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearTicketSubtask } = jiraSlice.actions;
export default jiraSlice.reducer;
