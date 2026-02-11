import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ReleaseGroup } from "../../types/jira";
import jiraApi from "../../api/jiraApi";
import { extractNumbers } from "../../utils/releaseUtils";

interface ReleaseState {
  allReleases: ReleaseGroup[];
  selectedRelease: ReleaseGroup | null;
  selectedReleaseNumber: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReleaseState = {
  allReleases: [],
  selectedRelease: null,
  selectedReleaseNumber: null,
  status: "idle",
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
    return rejectWithValue(
      (err.message as string) || "Failed to fetch all release",
    );
  }
});

export const updateCurrentRelease = createAsyncThunk(
  "jira/updateCurrentRelease",
  async (_, { rejectWithValue }) => {
    try {
      await jiraApi.updateCurrentRelease();
    } catch (err: any) {
      return rejectWithValue(err.message as string);
    }
  },
);

const releaseSlice = createSlice({
  name: "releases",
  initialState,
  reducers: {
    setSelectedRelease: (state, action: PayloadAction<ReleaseGroup | null>) => {
      state.selectedRelease = action.payload;
      state.selectedReleaseNumber = action.payload
        ? extractNumbers(action.payload.releaseName)
        : null;
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
      });
  },
});

const releaseReducer = releaseSlice.reducer;
export default releaseReducer;
export const { setSelectedRelease } = releaseSlice.actions;
