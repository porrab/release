import { Box } from "@mui/material";
import ImportExportActions from "../../components/ImportExportAction";
import type { Productivity } from "../../types/productivitySquad";
import ProductivityTable from "./component/ProductivityTable";
import { useState } from "react";
import ImportFilterModal from "../Home/component/ImportFilterModal";
const sampleProductivity: Productivity[] = [
  {
    squadProductivity: { verticals: "Payments", release: "Release-16.2" },
    tasks: {
      noOfSprints: 5,
      noOfDev: 8,
      maxTimeSpentHours: 45,
      noOfTickets: 32,
      noOfSubtasks: 58,
      totalTasksComplete: 30,
    },
    defects: { sitWeight: 0.8, sitSize: 12, totalSitDefects: 10 },
    workingHours: {
      workingTimeRatio: 0.85,
      timeSpentHours: 320,
      totalWorkingHours: 380,
    },
    storyPoints: {
      totalStoryPointsWithSubtasks: 150,
      storyPoints: 120,
      averageStoryPoint: 5,
    },
    productivityScore: { rawScore: 78.5, adjustScore: 82.3, finalGrade: "B" },
    multiplyRatio: 1.1,
  },
  {
    squadProductivity: { verticals: "Auth", release: "Release-16.3" },
    tasks: {
      noOfSprints: 3,
      noOfDev: 5,
      maxTimeSpentHours: 60,
      noOfTickets: 18,
      noOfSubtasks: 22,
      totalTasksComplete: 16,
    },
    defects: { sitWeight: 0.6, sitSize: 8, totalSitDefects: 4 },
    workingHours: {
      workingTimeRatio: 0.9,
      timeSpentHours: 210,
      totalWorkingHours: 233,
    },
    storyPoints: {
      totalStoryPointsWithSubtasks: 80,
      storyPoints: 70,
      averageStoryPoint: 4.375,
    },
    productivityScore: { rawScore: 85.2, adjustScore: 87.0, finalGrade: "A" },
    multiplyRatio: 1.0,
  },
  {
    squadProductivity: { verticals: "Checkout", release: "Release-16.1" },
    tasks: {
      noOfSprints: 6,
      noOfDev: 10,
      maxTimeSpentHours: 120,
      noOfTickets: 45,
      noOfSubtasks: 90,
      totalTasksComplete: 42,
    },
    defects: { sitWeight: 1.2, sitSize: 20, totalSitDefects: 25 },
    workingHours: {
      workingTimeRatio: 0.75,
      timeSpentHours: 480,
      totalWorkingHours: 640,
    },
    storyPoints: {
      totalStoryPointsWithSubtasks: 260,
      storyPoints: 200,
      averageStoryPoint: 5,
    },
    productivityScore: { rawScore: 62.4, adjustScore: 65.0, finalGrade: "C" },
    multiplyRatio: 0.95,
  },
  {
    squadProductivity: { verticals: "Notifications", release: "Hotfix-1" },
    tasks: {
      noOfSprints: 1,
      noOfDev: 2,
      maxTimeSpentHours: 8,
      noOfTickets: 4,
      noOfSubtasks: 6,
      totalTasksComplete: 4,
    },
    defects: { sitWeight: 0.2, sitSize: 2, totalSitDefects: 0 },
    workingHours: {
      workingTimeRatio: 0.98,
      timeSpentHours: 40,
      totalWorkingHours: 41,
    },
    storyPoints: {
      totalStoryPointsWithSubtasks: 10,
      storyPoints: 8,
      averageStoryPoint: 4,
    },
    productivityScore: { rawScore: 92.0, adjustScore: 93.5, finalGrade: "A" },
    multiplyRatio: 1.2,
  },
  {
    squadProductivity: { verticals: "Analytics", release: "Release-15.9" },
    tasks: {
      noOfSprints: 4,
      noOfDev: 6,
      maxTimeSpentHours: 0,
      noOfTickets: 0,
      noOfSubtasks: 0,
      totalTasksComplete: 0,
    },
    defects: { sitWeight: 0, sitSize: 0, totalSitDefects: 0 },
    workingHours: {
      workingTimeRatio: 0.0,
      timeSpentHours: 0,
      totalWorkingHours: 0,
    },
    storyPoints: {
      totalStoryPointsWithSubtasks: 0,
      storyPoints: 0,
      averageStoryPoint: 0,
    },
    productivityScore: { rawScore: 0, adjustScore: 0, finalGrade: "F" },
    multiplyRatio: 1.0,
  },
];

export default function ProductivityPage() {
  const [openImport, setOpenImport] = useState(false);
  function handleSubmit() {}
  function handleImport() {
    setOpenImport(true);
  }
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end", mb: 3 }}>
        <ImportExportActions onImport={handleImport} />
      </Box>
      <ProductivityTable data={sampleProductivity} />
      <ImportFilterModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
