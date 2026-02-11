export type PerformanceGrade = "A" | "B" | "C" | "D" | "F";

interface SquadProductivity {
  verticals: string;
  release: string;
}

interface Tasks {
  noOfSprints: number;
  noOfDev: number;
  maxTimeSpentHours: number;
  noOfTickets: number;
  noOfSubtasks: number;
  totalTasksComplete: number;
}

interface Defects {
  sitWeight: number;
  sitSize: number;
  totalSitDefects: number;
}

interface WorkingHours {
  workingTimeRatio: number;
  timeSpentHours: number;
  totalWorkingHours: number;
}

interface StoryPoints {
  totalStoryPointsWithSubtasks: number;
  storyPoints: number;
  averageStoryPoint: number;
}

interface ProductivityScore {
  rawScore: number;
  adjustScore: number;
  finalGrade: PerformanceGrade;
}

export interface Productivity {
  squadProductivity: SquadProductivity;
  tasks: Tasks;
  defects: Defects;
  workingHours: WorkingHours;
  storyPoints: StoryPoints;
  productivityScore: ProductivityScore;
  multiplyRatio: number;
}
