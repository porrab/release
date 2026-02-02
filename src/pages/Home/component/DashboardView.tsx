import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  TablePagination,
  Tooltip,
  Grid,
} from "@mui/material";

import TicketDetailDialog from "./TicketDetailDialog";
import type {
  DashboardResponse,
  JiraIssue,
  TicketDetailType,
} from "../../../types/jira";
import StatCard from "./StatCard";
import TicketTypeIcon from "./TicketTypeIcon";

interface DashboardViewProps {
  data: DashboardResponse;
}

export default function DashboardView({ data }: DashboardViewProps) {
  const { releaseInfo, stats, tickets } = data;

  const [viewingTicket, setViewingTicket] = useState<TicketDetailType | null>(
    null,
  );
  const [currentParent, setCurrentParent] = useState<JiraIssue | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedTickets = tickets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleOpenParent = (ticket: JiraIssue) => {
    setCurrentParent(ticket);
    setViewingTicket(ticket);
  };

  const handleClose = () => {
    setViewingTicket(null);
    setCurrentParent(null);
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h6" color="textSecondary">
          {releaseInfo.description || `Dashboard for ${releaseInfo.name}`}
        </Typography>
      </Box>

      {/* Stat Cards */}
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
            value={(stats.totalTimeSeconds / 3600).toFixed(1) + " h"}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      {/* Ticket Table Section */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box p={3} pb={1}>
          <Typography variant="h6" fontWeight="bold">
            Ticket Details
          </Typography>
        </Box>

        <Box sx={{ mt: 1 }}>
          {tickets.length === 0 ? (
            <Typography align="center" color="textSecondary" py={3}>
              No tickets found.
            </Typography>
          ) : (
            <Box>
              {displayedTickets.map((t) => (
                <Box
                  key={t.key}
                  px={3}
                  py={1.5}
                  borderBottom="1px solid #eee"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{ "&:hover": { bgcolor: "#fafafa" } }}
                >
                  {/* Icon + Key */}
                  <Box
                    sx={{
                      minWidth: "140px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Tooltip title={t.type}>
                      <Box display="flex" component="span">
                        {<TicketTypeIcon type={t.type}></TicketTypeIcon>}
                      </Box>
                    </Tooltip>

                    <span
                      style={{
                        cursor: "pointer",
                        color: "#1976d2",
                        fontWeight: "bold",
                        lineHeight: 1,
                      }}
                      onClick={() => handleOpenParent(t)}
                    >
                      {t.key}
                    </span>
                  </Box>

                  {/* Summary */}
                  <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, overflow: "hidden" }}
                    noWrap
                    title={t.summary}
                  >
                    {t.summary}
                  </Typography>

                  {/* Status & Assignee */}
                  <Box display="flex" alignItems="center" gap={2}>
                    {t.assignee && (
                      <Tooltip title={t.assignee.displayName}>
                        <Avatar
                          src={t.assignee.avatarUrl}
                          sx={{ width: 24, height: 24 }}
                        />
                      </Tooltip>
                    )}
                    <Chip
                      label={t.status}
                      size="small"
                      variant="outlined"
                      color={
                        t.statusCategory === "done"
                          ? "success"
                          : t.statusCategory === "indeterminate"
                            ? "warning"
                            : "default"
                      }
                    />
                  </Box>
                </Box>
              ))}

              <TablePagination
                component="div"
                count={tickets.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Rows:"
              />
            </Box>
          )}
        </Box>
      </Paper>

      <TicketDetailDialog
        open={!!viewingTicket}
        onClose={handleClose}
        ticket={viewingTicket}
        parentTicket={currentParent}
        onNavigate={(targetTicket) => setViewingTicket(targetTicket)}
      />
    </Box>
  );
}
