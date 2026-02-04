export interface AvatarUrls {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface Assignee {
  displayName: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
}

export interface CountSummary {
  // release, task
  reopenCount: number;
  prCount: number;
  commentCount: number;
}

export interface SprintDTO {
  sprintId: number;
  sprintName: string;
  state: string;
  boardId: number;
  startDate: string;
  endDate: string;
}

export interface SubTaskDTO {
  ticketId: string;
  key: string;
  summary: string;
  type: string;
  priority: string;
  status: string;
  description: string;
  assignee: Assignee;
  countSummary: CountSummary;
  timespent: string;
  created: string;
}

export interface TicketDTO {
  ticketId: string;
  key: string;
  summary: string;
  type: string;
  priority: string;
  status: string;
  description: string;
  assignee: Assignee;
  timespent: string;
  storyPoints: number;
  sprints: SprintDTO[];
  countSummary: CountSummary;
  created: string;
}

export interface PagedTickets {
  tickets: TicketDTO[];
  nextPageToken: string;
}

export interface ReleaseGroup {
  releaseId: string;
  releaseName: string;
}
