import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  Grid,
  Avatar,
  CircularProgress,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { TicketDTO, SubTaskDTO, SprintDTO } from "../../../types/jira";
import Status from "./Status";
import TicketTypeIcon from "./TicketTypeIcon";
import formatSecondsToHMS from "../../../utils/convertTime";
import { formatDate } from "../../../utils/formatDate";
import Priority from "./Priority";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { mdComponents } from "./MarkDownMap";

interface TicketDetailDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: TicketDTO | SubTaskDTO | null;
  loading?: boolean;
  onNavigate?: (ticket: TicketDTO | SubTaskDTO) => void;
}

function getInitials(name?: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const getSprintColor = (state?: string) => {
  const s = (state || "").toLowerCase();
  if (s.includes("active") || s.includes("in progress"))
    return { bgcolor: "#e3f2fd", color: "#1565c0" };
  if (s.includes("closed") || s.includes("completed"))
    return { bgcolor: "#e8f5e9", color: "#2e7d32" };
  if (s.includes("future") || s.includes("planned"))
    return { bgcolor: "#fff8e1", color: "#f57f17" };
  return { bgcolor: "#f5f5f5", color: "#616161" };
};

export default function TicketDetailDialog({
  open,
  onClose,
  ticket,
  loading = false,
}: TicketDetailDialogProps) {
  if (!ticket && !loading) return null;

  const timespent = Number((ticket as any)?.timespent) || 0;
  const storyPoints =
    "storyPoints" in (ticket || {})
      ? (ticket as TicketDTO).storyPoints
      : undefined;

  const subtasks = (ticket as any)?.subtasks ?? [];
  const assignee = (ticket as any)?.assignee as
    | {
        displayName?: string;
        emailAddress?: string;
        avatarUrls?: { md?: string };
      }
    | undefined;

  // normalize sprints: TicketDTO has sprints: SprintDTO[]
  const sprints: SprintDTO[] = Array.isArray((ticket as any)?.sprints)
    ? (ticket as any).sprints
    : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ px: 3, py: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            {ticket && (
              <TicketTypeIcon
                description="Issue Type"
                type={(ticket as any).type}
              />
            )}
            <Box>
              <Typography variant="h6" component="div">
                {ticket?.key ?? ""}
              </Typography>
              <Typography
                component="span"
                variant="subtitle1"
                color="text.secondary"
              >
                {ticket?.summary ?? ""}
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={onClose} size="small" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          ticket && (
            <Grid container spacing={3}>
              {/* Left column: main content */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Description
                </Typography>
                <Box
                  mb={2}
                  sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                    components={mdComponents}
                  >
                    {ticket.description || "No description provided."}
                  </ReactMarkdown>
                </Box>

                {Array.isArray(subtasks) && subtasks.length > 0 && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Subtasks
                    </Typography>
                    <List dense>
                      {subtasks.map((st: any) => (
                        <ListItem key={st.key} disableGutters>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 28, height: 28 }}>
                              {getInitials(st.assignee?.displayName)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" fontWeight="bold">
                                  {st.key}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {st.summary}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {(st.assignee?.displayName ?? "Unassigned") +
                                  " • " +
                                  (st.status ?? "")}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Grid>

              {/* Right column: meta */}
              <Grid
                sx={{
                  display: "flex",
                  position: { xs: "static", md: "sticky" },
                  top: { xs: "auto", md: 24 },
                  alignSelf: "flex-start",
                  zIndex: { md: 1 },
                }}
                size={{ xs: 12, md: 4 }}
              >
                <Box bgcolor="#f8f9fa" p={2} borderRadius={2}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    color="text.secondary"
                  >
                    Assignee
                  </Typography>

                  {assignee?.displayName ? (
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Avatar
                        src={assignee.avatarUrls?.md}
                        sx={{ width: 40, height: 40 }}
                      >
                        {getInitials(assignee.displayName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {assignee.displayName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {assignee.emailAddress}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Unassigned
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2" mb={1}>
                    <strong>Time Spent:</strong> {formatSecondsToHMS(timespent)}
                  </Typography>

                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    <strong>Created:</strong> {formatDate(ticket.created)}
                  </Typography>

                  {/* Related Sprints */}
                  <Divider sx={{ my: 1 }} />
                  <Box mt={1}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      color="text.secondary"
                    >
                      Related Sprints
                    </Typography>

                    {Array.isArray(sprints) && sprints.length > 0 ? (
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {sprints.map((sp) => {
                          const color = getSprintColor(sp.state);
                          const start = sp?.startDate
                            ? formatDate(sp.startDate)
                            : "N/A";
                          const end = sp?.endDate
                            ? formatDate(sp.endDate)
                            : "N/A";
                          const title = `${sp.sprintName} • ${sp.state ?? "Unknown"} •
                          Start: ${start} • End: ${end}`;
                          return (
                            <Tooltip
                              key={sp.sprintId ?? sp.sprintName}
                              title={title}
                            >
                              <Chip
                                label={sp.sprintName}
                                size="small"
                                sx={{
                                  backgroundColor: color.bgcolor,
                                  color: color.color,
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                  borderRadius: 1,
                                  height: 28,
                                }}
                              />
                            </Tooltip>
                          );
                        })}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No related sprints
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" spacing={2} flexWrap="wrap" mt={2}>
                    <Box>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        Status
                      </Typography>
                      <Status status={(ticket as any).status} />
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        Priority
                      </Typography>
                      <Priority priority={ticket.priority}></Priority>
                    </Box>

                    {typeof storyPoints !== "undefined" && (
                      <Box>
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          Story Points
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {storyPoints ?? 0}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
