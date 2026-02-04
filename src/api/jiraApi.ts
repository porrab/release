import axiosService from "./axiosClient";
import type { PagedTickets, ReleaseGroup, SubTaskDTO } from "../types/jira";

const jiraApi = {
  getAllRelease: async () => {
    try {
      const response = await axiosService.get<ReleaseGroup[]>(`/dps/releases`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all releases:", error);
    }
  },

  getReleaseDetailById: async (releaseId: string) => {
    try {
      const response = await axiosService.get<PagedTickets>(
        `/dps/release/${releaseId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching release by id:", error);
      throw error;
    }
  },

  getSubtaskByKey: async (key: string) => {
    try {
      const response = await axiosService.get<SubTaskDTO[]>(
        `/dps/tickets/${key}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subtask by key:", error);
    }
  },
};

export default jiraApi;
