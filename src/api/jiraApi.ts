import type { JiraReleaseInfo, DashboardResponse } from "../types/jira";
import axiosService from "./axiosClient";

const jiraApi = {
  getAllReleases: () => axiosService.get<JiraReleaseInfo[]>("/releases"),

  getDashboardByReleaseId: (id: string) =>
    axiosService
      .get<DashboardResponse[]>(`/dashboard?releaseId=${id}`)
      .then((res) => {
        return res.data[0];
      }),
};

export default jiraApi;
