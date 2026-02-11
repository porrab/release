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
  CircularProgress,
} from "@mui/material";

import TicketDetailDialog from "./TicketDetailDialog";

import type { TicketDTO, SubTaskDTO } from "../../../../types/jira";
import StatCard from "./StatCard";
import TicketTypeIcon from "./TicketTypeIcon";
import formatSecondsToHMS from "../../../../utils/convertTime";
import Status from "./Status";

import { useAppDispatch } from "../../../../hook/hook";
import {
  fetchReleaseById,
  fetchTicketDetail,
} from "../../../../features/jira/jiraSlice";
import { useAlert } from "../../../../components/AlertContext";

interface DashboardViewProps {
  loadingMore: boolean;
  data: {
    releaseId?: string;
    releaseName: string;
    tickets: TicketDTO[];
    nextPageToken: string | null;
    stats?: {
      totalTicketCount: number;
      totalStoryPoints: number;
      totalTimeSeconds: number;
    };
  };
}

export default function DashboardView({
  data,
  loadingMore,
}: DashboardViewProps) {
  const { releaseName, tickets = [], stats, nextPageToken, releaseId } = data;

  const [viewingTicket, setViewingTicket] = useState<
    TicketDTO | SubTaskDTO | null
  >(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { push } = useAlert();

  const dispatch = useAppDispatch();

  useEffect(() => {
    setPage(0);
  }, [releaseName]);

  const handleTicketClick = async (ticketKey: string) => {
    setIsLoadingDetail(true);
    setError(null);
    setIsOpen(true);

    try {
      const result = await dispatch(fetchTicketDetail(ticketKey)).unwrap();

      if (result && result.length > 0) {
        setViewingTicket(result[0]);
      } else {
        const mainTicket = tickets.find((t) => t.key === ticketKey);
        if (mainTicket) setViewingTicket(mainTicket);
      }
    } catch (err: any) {
      console.error("Error fetching detail:", err);
      setError(err ?? "Cannot fetch task detail");

      push({ severity: "error", message: err ?? "Cannot fetch task detail" });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    const loadedCount = tickets.length;
    const requiredCount = (newPage + 1) * rowsPerPage;

    if (requiredCount > loadedCount && nextPageToken && releaseId) {
      dispatch(
        fetchReleaseById({
          releaseId: releaseId,
          nextPageToken: nextPageToken,
        }),
      );
    }
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
        <Typography variant="h5">{releaseName}</Typography>
        <Typography variant="h6" color="textSecondary">
          Dashboard for {releaseName}
        </Typography>
      </Box>

      {/* Stat Cards stats */}
      {stats && (
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
      )}

      {/* Ticket Table Section */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box p={3} pb={1}>
          <Typography variant="h6" fontWeight="bold">
            Ticket Details
          </Typography>
        </Box>

        {loadingMore && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress sx={{ width: "100%" }} />
          </Box>
        )}

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

                  <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, overflow: "hidden" }}
                    noWrap
                    title={t.summary}
                  >
                    {t.summary}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={2}>
                    {t.assignee && (
                      <Tooltip title={t.assignee.displayName}>
                        <Avatar
                          src={t.assignee.avatarUrls?.md}
                          sx={{ width: 24, height: 24 }}
                        />
                      </Tooltip>
                    )}

                    <Status status={t.status} />
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
                  count={nextPageToken ? tickets.length + 1 : tickets.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 15, 30]}
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
          setViewingTicket(targetTicket as any);
        }}
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
