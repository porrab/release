import { Paper, Typography, Box, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import type { DashboardResponse } from "../../../types/jira";
import StatCard from "./StatCard";
import formatSecondsToHMS from "../../../utils/convertTime";

interface DashboardViewProps {
  data: DashboardResponse;
}

export default function DashboardView({ data }: DashboardViewProps) {
  const { releaseInfo, stats, tickets } = data;

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h6" color="textSecondary">
          {releaseInfo.description || `Dashboard for ${releaseInfo.name}`}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Total Tickets"
            value={stats.totalTicketCount}
            color="#1976d2"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Total Story Points"
            value={stats.totalStoryPoints}
            color="#2e7d32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Total Hours Spent"
            value={formatSecondsToHMS(stats.totalTimeSeconds)}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, width: "100%" }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Ticket Details
        </Typography>

        <Box sx={{ mt: 2 }}>
          {tickets.length === 0 ? (
            <Typography align="center" color="textSecondary">
              No tickets found.
            </Typography>
          ) : (
            <div style={{ width: "100%" }}>
              <p>Ticket Table (Rows: {tickets.length})</p>
              {tickets.map((t) => (
                <Box
                  key={t.key}
                  p={1}
                  borderBottom="1px solid #eee"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <span>
                    <strong>{t.key}</strong>: {t.summary}
                  </span>
                  <Chip
                    label={t.status}
                    size="small"
                    color={
                      t.statusCategory === "done"
                        ? "success"
                        : t.statusCategory === "indeterminate"
                          ? "warning"
                          : "default"
                    }
                  />
                </Box>
              ))}
            </div>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
