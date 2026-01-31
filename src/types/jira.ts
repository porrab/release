export type JiraStatus = "To do" | "In Progress" | "Done";

export type IssueType = "Epic" | "Task" | "Story" | "Bug" | "Sub Task";

export interface JiraUser {
  accountId: string;
  name: string;
  profile?: string;
}

interface BaseTicket {
  id: string;
  key: string;
  description: string;
  status: JiraStatus;
  type: IssueType;
  assignee: JiraUser;
  timeSpent: string;
}

export interface JiraSubtask extends BaseTicket {
  type: "Sub Task";
}

export interface JiraIssue extends BaseTicket {
  type: "Task" | "Story" | "Bug";
  storyPoint: number;
  subTask: JiraSubtask[];
}

export interface JiraEpic extends BaseTicket {
  type: "Epic";
  childIssue: JiraIssue[];
}

export interface Stat {
  totalStoryPoints: number;
  percentageCompleted: number;
}

export interface JiraRelease {
  id: string;
  name: string;
  releaseDate: string;
  status: "Release" | "Unreleased";
  epics: JiraEpic[];
  issues: JiraIssue[];
  stats: Stat;
}
