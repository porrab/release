import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Divider,
  Box,
  Avatar,
  Breadcrumbs,
  Link,
  Grid,
} from "@mui/material";

import type { JiraIssue, TicketDetailType } from "../../../types/jira";

interface TicketDetailDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: TicketDetailType | null;
  onNavigate?: (ticket: TicketDetailType) => void;
  parentTicket?: JiraIssue | null;
}

export default function TicketDetailDialog({
  open,
  onClose,
  ticket,
  onNavigate,
  parentTicket,
}: TicketDetailDialogProps) {
  if (!ticket) return null;

  const isSubtask = ticket.type === "Sub-task";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isSubtask && parentTicket ? (
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
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
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
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
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Sub-tasks ({(ticket as JiraIssue).subtasks.length})
                </Typography>
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
                      sx={{ "&:hover": { bgcolor: "#eee" } }}
                    >
                      <Box display="flex" gap={1}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="primary"
                        >
                          {sub.key}
                        </Typography>
                        <Typography variant="body2">{sub.summary}</Typography>
                      </Box>
                      <Chip
                        label={sub.status}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </div>
                ))}
              </>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              {/* Status */}
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Status
                </Typography>
                <Box mt={0.5}>
                  <Chip label={ticket.status} color="primary" />
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
                    Story Points
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {(ticket as JiraIssue).storyPoints || "-"}
                  </Typography>
                </Box>
              )}

              {!isSubtask && (
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Git Branch
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ fontFamily: "monospace", bgcolor: "#eee", p: 0.5 }}
                  >
                    {(ticket as JiraIssue).gitStats?.branchName || "-"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        {isSubtask && parentTicket && (
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
