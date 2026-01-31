import { CardContent, Typography } from "@mui/material";
import type { JiraEpic } from "../../../types/jira";

interface EpicProps {
  epics: JiraEpic[];
  expand: boolean;
}

export default function EpicList({ epics, expand }: EpicProps) {
  return (
    <>
      {expand &&
        epics.map((epic) => (
          <CardContent key={epic.id}>
            <Typography>{epic.description}</Typography>
          </CardContent>
        ))}
    </>
  );
}
