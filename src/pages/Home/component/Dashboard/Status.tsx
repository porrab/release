import { Chip } from "@mui/material";

interface StatusProps {
  status: string;
}

type StatusStyle = {
  bgcolor: string;
  color: string;
  label: string;
};

const STATUS_MAP: { keywords: string[]; style: Omit<StatusStyle, "label"> }[] =
  [
    {
      keywords: [
        "done",
        "closed",
        "resolved",
        "finished",
        "completed",
        "released",
        "shipped",
        "verified",
      ],
      style: { bgcolor: "#e8f5e9", color: "#2e7d32" },
    },
    {
      keywords: [
        "in progress",
        "progress",
        "doing",
        "working",
        "developing",
        "in development",
        "open",
      ],
      style: { bgcolor: "#e3f2fd", color: "#1976d2" },
    },
    {
      keywords: ["review", "code review", "in review", "peer review"],
      style: { bgcolor: "#fff3e0", color: "#ef6c00" },
    },
    {
      keywords: ["qa", "testing", "in testing", "qa review", "ready for qa"],
      style: { bgcolor: "#f3e5f5", color: "#6a1b9a" },
    },
    {
      keywords: ["blocked", "on hold", "blocked by", "blocked:"],
      style: { bgcolor: "#ffebee", color: "#c62828" },
    },
    {
      keywords: [
        "todo",
        "to do",
        "backlog",
        "selected for development",
        "ready",
      ],
      style: { bgcolor: "#f5f5f5", color: "#616161" },
    },
    {
      keywords: ["reopened", "reopen"],
      style: { bgcolor: "#fff8e1", color: "#f57f17" },
    },
    {
      keywords: ["cancelled", "canceled", "wontfix"],
      style: { bgcolor: "#fbe9e7", color: "#8e24aa" },
    },
    {
      keywords: ["duplicate"],
      style: { bgcolor: "#eceff1", color: "#455a64" },
    },
    {
      keywords: ["in analysis", "design", "spec", "planning"],
      style: { bgcolor: "#e1f5fe", color: "#0288d1" },
    },
    {
      keywords: ["merged", "merged to"],
      style: { bgcolor: "#e8f5e9", color: "#2e7d32" },
    },
    {
      keywords: ["deploy", "deployment", "released"],
      style: { bgcolor: "#e8f5e9", color: "#2e7d32" },
    },
  ];

function normalizeLabel(s: string) {
  if (!s) return "Unknown";
  return s
    .split(/[\s-_]+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export default function Status({ status }: StatusProps) {
  const s = (status || "").toLowerCase().trim();

  for (const entry of STATUS_MAP) {
    for (const kw of entry.keywords) {
      if (s.includes(kw)) {
        return (
          <Chip
            label={normalizeLabel(status)}
            size="small"
            sx={{
              backgroundColor: entry.style.bgcolor,
              color: entry.style.color,
              fontWeight: "bold",
              fontSize: "0.75rem",
              borderRadius: "4px",
              height: "24px",
            }}
          />
        );
      }
    }
  }

  // fallback
  return (
    <Chip
      label={normalizeLabel(status) || "Unknown"}
      size="small"
      sx={{
        backgroundColor: "#f5f5f5",
        color: "#616161",
        fontWeight: "bold",
        fontSize: "0.75rem",
        borderRadius: "4px",
        height: "24px",
      }}
    />
  );
}
