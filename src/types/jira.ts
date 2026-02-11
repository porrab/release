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

export interface BitBucketSummary {
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
  BitBucketSummary: BitBucketSummary;
  timespent: string;
  created: string;
  storyPoints: number;
}

export interface TicketDTO {
  ticketId: string; //
  key: string; //
  summary: string; //
  type: string; //
  priority: string; //
  status: string; //
  description: string; //
  assignee: Assignee; //
  timespent: string; //
  storyPoints: number; //
  sprints: SprintDTO[]; //
  BitBucketSummary: BitBucketSummary; // ?
  created: string; //
  releaseName: string; //

  startDate: string; //
  endDate: string; //
}

export interface PagedTickets {
  releaseId: string;
  releaseName: string;

  tickets: TicketDTO[];
  nextPageToken: string | null; // !!
}

export interface ReleaseGroup {
  releaseId: string;
  releaseName: string;
}
