import type { JiraRelease } from "../types/jira";
import axiosService from "./axiosClient";

const jiraApi = {
  getRelease: () => axiosService.get<JiraRelease[]>("/releases"),
  getReleaseById: (id: string) =>
    axiosService.get<JiraRelease>(`/releases/${id}`),
};

export default jiraApi;
