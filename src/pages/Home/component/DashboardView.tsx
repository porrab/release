import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Avatar,
  TablePagination,
  Tooltip,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";

import TicketDetailDialog from "./TicketDetailDialog";
import type { JiraIssue, TicketDetailType } from "../../../types/jira";
import StatCard from "./StatCard";
import TicketTypeIcon from "./TicketTypeIcon";
import formatSecondsToHMS from "../../../utils/convertTime";
import Status from "./Status";

import { useAppDispatch, useAppSelector } from "../../../hook/hook";
import { fetchTicketDetail } from "../../../features/jira/jiraSlice";
import type { DashboardResponse } from "../../../types/dashboard";

interface DashboardViewProps {
  data: DashboardResponse;
}

export default function DashboardView({ data }: DashboardViewProps) {
  const { releaseInfo, stats } = data;

  const [viewingTicket, setViewingTicket] = useState<TicketDetailType | null>(
    null,
  );
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [currentParent, setCurrentParent] = useState<JiraIssue | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fullDetail = useAppSelector((state) => state.releases.ticketDetail);
  const dispatch = useAppDispatch();

  const tickets = Array.isArray(releaseInfo?.tickets)
    ? releaseInfo.tickets
    : [];

  useEffect(() => {
    setPage(0);
  }, [releaseInfo.releaseId, tickets.length]);

  const handleTicketClick = async (ticketKey: string) => {
    setIsLoadingDetail(true);
    setError(null);
    setIsOpen(true);

    try {
      if (fullDetail?.key === ticketKey) {
        setViewingTicket(fullDetail);
        if (!fullDetail.type.toLowerCase().includes("sub")) {
          setCurrentParent(fullDetail as JiraIssue);
        }
        return;
      }

      const releaseId = String(releaseInfo?.releaseId ?? "");

      if (!releaseId) {
        setError("Release id is missing");
        return;
      }

      const result = await dispatch(
        fetchTicketDetail({ releaseId, ticketKey }),
      ).unwrap();

      if (result) {
        // If result is a parent issue, set as currentParent
        if (!result.type.toLowerCase().includes("sub")) {
          setCurrentParent(result as JiraIssue);
        } else {
          // If result is a sub-task, optionally fetch its parent
          // (only if your API supports fetching parent by subtask; otherwise skip)
          // Example: if result has parent key: result.parentKey -> dispatch fetchTicketDetail for parent
        }
        setViewingTicket(result);
      }
    } catch (err: any) {
      console.error("Error fetching detail:", err);
      setError(err?.message ?? "Cannot fetch task detail");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
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

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5">{releaseInfo.releaseName}</Typography>
        <Typography variant="h6" color="textSecondary">
          {releaseInfo.description ||
            `Dashboard for ${releaseInfo.releaseName}`}
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
            value={formatSecondsToHMS(stats.totalTimeSeconds || 0)}
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
                        <TicketTypeIcon type={t.type} />
                      </Box>
                    </Tooltip>

                    <span
                      style={{
                        cursor: "pointer",
                        color: "#1976d2",
                        fontWeight: "bold",
                        lineHeight: 1,
                      }}
                      onClick={() => handleTicketClick(t.key)}
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
                    <Status
                      status={t.status?.statusCategory?.name || "unKnow"}
                      statusCategory={t.status?.statusCategory?.key}
                    />
                  </Box>
                </Box>
              ))}

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                ml={3}
              >
                <Box display="flex" maxWidth={400} overflow={"auto"}>
                  {["Bug", "Task", "Story", "Sub-task"].map((type) => (
                    <Typography
                      key={type}
                      display="flex"
                      alignItems="center"
                      gap={0.5}
                      mr={2}
                    >
                      <TicketTypeIcon type={type} /> {type}
                    </Typography>
                  ))}
                </Box>
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
            </Box>
          )}
        </Box>
      </Paper>

      <TicketDetailDialog
        open={isOpen}
        onClose={() => {
          setViewingTicket(null);
          setIsOpen(false);
        }}
        ticket={viewingTicket}
        loading={isLoadingDetail}
        onNavigate={(targetTicket) => {
          setViewingTicket(targetTicket);
        }}
        parentTicket={currentParent}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
