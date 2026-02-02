export interface JiraUser {
  accountId: string;
  displayName: string;
  avatarUrl: string;
}

export interface JiraSprint {
  id: number;
  name: string;
  state: "active" | "closed" | "future";
  startDate: string;
  endDate: string;
  completeDate?: string;
}

export interface JiraReleaseInfo {
  id: string;
  name: string;
  description?: string;
}

export interface GitStats {
  branchName: string;
  commitCount: number;
  prCount: number;
  lastCommitDate?: string;
}

interface BaseTicket {
  key: string;
  summary: string;
  description?: string;
  status: string;
  statusCategory: "new" | "indeterminate" | "done";

  type: "Story" | "Task" | "Bug" | "Sub-task";
  priority: string;
  created: string;
  dueDate: string | null;
  timeSpentSeconds: number | null;
  assignee?: JiraUser;

  sprint?: JiraSprint;
  release?: JiraReleaseInfo;
}

export interface JiraSubtask extends BaseTicket {
  type: "Sub-task";
  parentKey: string;
}

export interface JiraIssue extends BaseTicket {
  type: "Story" | "Task" | "Bug";
  storyPoints: number | null;
  reopenCount: number;

  gitStats?: GitStats;

  subtasks: JiraSubtask[];
}

export interface DashboardResponse {
  releaseInfo: JiraReleaseInfo;
  stats: {
    totalTicketCount: number;
    totalStoryPoints: number;
    totalTimeSeconds: number;
  };
  tickets: JiraIssue[];
}

export type TicketDetailType = JiraIssue | JiraSubtask;
