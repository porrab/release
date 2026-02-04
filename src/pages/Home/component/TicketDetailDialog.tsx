import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  Avatar,
  Breadcrumbs,
  Link,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Chip,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import type { JiraIssue, TicketDetailType } from "../../../types/jira";
import Status from "./Status";
import { formatDate } from "../../../utils/formatDate";

interface TicketDetailDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: TicketDetailType | null;
  onNavigate?: (ticket: TicketDetailType) => void;
  parentTicket?: JiraIssue | null;
  loading?: boolean;
}

export default function TicketDetailDialog({
  open,
  onClose,
  ticket,
  onNavigate,
  parentTicket,
  loading = false,
}: TicketDetailDialogProps) {
  if (!open) return null;

  const isSubtask = ticket?.type?.toLowerCase().includes("sub");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* -------------------- Header -------------------- */}
      <DialogTitle>
        {loading ? (
          <Box>
            <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={32} />
          </Box>
        ) : ticket ? (
          <>
            {isSubtask && parentTicket ? (
              <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
                <Link
                  underline="hover"
                  color="inherit"
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => onNavigate?.(parentTicket)}
                >
                  {parentTicket.key}
                </Link>
                <Typography color="text.primary" fontWeight="bold">
                  {ticket.key}
                </Typography>
              </Breadcrumbs>
            ) : (
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {ticket.key}
                </Typography>
              </Box>
            )}

            <Typography
              variant="body1"
              color="textSecondary"
              mt={isSubtask ? 0 : 0}
            >
              {ticket.summary}
            </Typography>
          </>
        ) : null}
      </DialogTitle>

      {/* -------------------- Content -------------------- */}
      <DialogContent dividers>
        {loading ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Description
              </Typography>
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ borderRadius: 1 }}
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Sub-tasks
              </Typography>
              <Box>
                <Skeleton variant="rounded" height={50} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" height={50} sx={{ mb: 1 }} />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box display="flex" flexDirection="column" gap={3}>
                {[1, 2, 3, 4].map((item) => (
                  <Box key={item}>
                    <Skeleton variant="text" width={80} sx={{ mb: 0.5 }} />
                    <Skeleton variant="rounded" height={32} width="100%" />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        ) : ticket ? (
          <Grid container spacing={3}>
            {/* ------------------------- Left  ----------------------- */}

            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {ticket.description || "No description provided."}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {!isSubtask && (ticket as JiraIssue).subtasks?.length > 0 && (
                <>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Sub-tasks ({(ticket as JiraIssue).subtasks.length})
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: 200,
                      overflowY: "auto",
                      pr: 1,
                    }}
                  >
                    {(ticket as JiraIssue).subtasks.map((sub) => (
                      <div
                        key={sub.key}
                        onClick={() => onNavigate?.(sub)}
                        style={{ cursor: "pointer" }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={1}
                          p={1}
                          bgcolor="#f9f9f9"
                          borderRadius={1}
                          sx={{
                            "&:hover": { bgcolor: "#eee" },
                          }}
                        >
                          <Box display="flex" gap={1}>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="primary"
                            >
                              {sub.key}
                            </Typography>
                            <Typography variant="body2">
                              {sub.summary}
                            </Typography>
                          </Box>
                          <Status
                            status={sub.status.name}
                            statusCategory={sub.status.statusCategory.key}
                          />
                        </Box>
                      </div>
                    ))}
                  </Box>
                </>
              )}
            </Grid>
            {/* ------------------------- Right  ----------------------- */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box display="flex" flexDirection="column" gap={2}>
                {/* Status */}
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box mt={0.5}>
                    <Status
                      status={
                        typeof ticket.status === "string"
                          ? ticket.status
                          : ticket.status?.name
                      }
                      statusCategory={
                        typeof ticket.status === "string"
                          ? "default"
                          : ticket.status?.statusCategory?.key
                      }
                    />
                  </Box>
                </Box>

                {/* Assignee */}
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Assignee
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Avatar
                      src={ticket.assignee?.avatarUrl}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="body2">
                      {ticket.assignee?.displayName || "Unassigned"}
                    </Typography>
                  </Box>
                </Box>

                {!isSubtask && (
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Sprint
                    </Typography>
                    <Box mt={0.5}>
                      {(ticket as JiraIssue).sprint &&
                      (ticket as JiraIssue).sprint.length > 0 ? (
                        <Stack direction="column" spacing={1}>
                          {(ticket as JiraIssue).sprint.map((sp, idx) => (
                            <Box
                              key={sp.sprintId || idx}
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              <Chip
                                label={sp.sprintName || `Sprint ${sp.sprintId}`}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                              <Tooltip
                                title={
                                  sp.startDate || sp.endDate
                                    ? `${formatDate(sp.startDate)} — ${formatDate(sp.endDate)}`
                                    : "No dates"
                                }
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  color="text.secondary"
                                >
                                  <CalendarTodayIcon
                                    fontSize="small"
                                    sx={{ mr: 0.5 }}
                                  />
                                  <Typography variant="caption">
                                    {sp.startDate || sp.endDate
                                      ? `${formatDate(sp.startDate)} — ${formatDate(sp.endDate)}`
                                      : "No dates"}
                                  </Typography>
                                </Box>
                              </Tooltip>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2">Not in a sprint</Typography>
                      )}
                    </Box>
                  </Box>
                )}

                {!isSubtask && (
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Story Points
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {(ticket as JiraIssue).storyPoints || "-"}
                    </Typography>
                  </Box>
                )}

                {!isSubtask && (
                  <Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Git Branch
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{
                          fontFamily: "monospace",
                          bgcolor: "#eee",
                          p: 0.5,
                        }}
                      >
                        {(ticket as JiraIssue).gitStats?.branchName || "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Pull Request count
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {(ticket as JiraIssue).gitStats?.prCount || "-"}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography align="center" py={5} color="textSecondary">
            No data available.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        {isSubtask && parentTicket && !loading && (
          <Button onClick={() => onNavigate?.(parentTicket)} color="primary">
            Back to Parent
          </Button>
        )}
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
