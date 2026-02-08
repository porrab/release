import axiosService from "./axiosClient";
import type { PagedTickets } from "../types/jira";

const jiraApi = {
  getAllRelease: async () => {
    try {
      const response = await axiosService.get(`/release/groups`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all releases:", error);
    }
  },

  fetchTicketsPage: async (
    releaseNumber: string,
    options?: { nextPageToken?: string | null; pageSize?: number },
  ): Promise<PagedTickets> => {
    try {
      const params: Record<string, string> = {};
      if (options?.pageSize) params.pageSize = String(options.pageSize);
      if (options?.nextPageToken) params.nextPageToken = options.nextPageToken;
      const response = await axiosService.get<PagedTickets>(
        `/release/${encodeURIComponent(releaseNumber)}/tickets`,
        { params },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tickets page", error);
      throw error;
    }
  },

  getSubtaskByKey: async (key: string) => {
    try {
      const response = await axiosService.get(`/tickets/${key}/subtasks`);
      return response.data;
    } catch (error) {
      console.error("Error fetching subtask by key:", error);
    }
  },

  updateCurrentRelease: async () => {
    try {
      await axiosService.get(`/release/groups/update`);
    } catch (error) {
      console.error("Error update current release", error);
    }
  },
};

export default jiraApi;
