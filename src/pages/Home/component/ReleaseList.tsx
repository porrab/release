import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  Collapse,
} from "@mui/material";
import type { JiraRelease } from "../../../types/jira";
import StatusButton from "./StatusButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "../../../components/ExpandMore";
import { useState } from "react";
import EpicList from "./EpicList";

interface ReleaseListProps {
  releases: JiraRelease[];
  isLoading: boolean;
}

export default function ReleaseList({ releases, isLoading }: ReleaseListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      {[...releases].reverse().map((release) => (
        <Card
          key={release.id}
          sx={{
            width: 350,
            minHeight: 200,
            mb: 4,
            boxShadow: 3,
            borderRadius: 2,
            transition: "0.3s",
            "&:hover": { boxShadow: 6 },
          }}
        >
          <CardHeader
            sx={{
              pb: 1,
              "& .MuiCardHeader-title": {
                fontWeight: "bold",
                fontSize: "1.1rem",
              },
            }}
            title={release.name}
            action={<StatusButton status={release.status} />}
          />

          <CardContent sx={{ pt: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Story Point: <strong>{release.stats.totalStoryPoints}</strong>
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Completed: <strong>{release.stats.percentageCompleted}%</strong>
            </Typography>
          </CardContent>

          <CardActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingLeft: "16px",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {release.releaseDate}
            </Typography>
            {release.epics.length !== 0 && (
              <ExpandMore
                text="Epics"
                expand={expandedId === release.id}
                onClick={() =>
                  setExpandedId(expandedId === release.id ? null : release.id)
                }
              >
                <ExpandMoreIcon />
              </ExpandMore>
            )}
          </CardActions>
          <Collapse in={expandedId === release.id} timeout="auto" unmountOnExit>
            <EpicList
              epics={release.epics}
              expand={expandedId === release.id}
            ></EpicList>
          </Collapse>
        </Card>
      ))}
    </>
  );
}
