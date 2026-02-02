import BugReportIcon from "@mui/icons-material/BugReport";
import BuildIcon from "@mui/icons-material/Build";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

interface TicketTypeIconProps {
  type: string;
}

export default function TicketTypeIcon({ type }: TicketTypeIconProps) {
  switch (type) {
    case "Bug":
      return <BugReportIcon color="error" fontSize="small" />;
    case "Story":
      return <AutoStoriesIcon color="success" fontSize="small" />;
    case "Task":
      return <BuildIcon color="primary" fontSize="small" />;
    case "Sub-task":
      return <CheckBoxIcon color="action" fontSize="small" />;
    default:
      return <CheckBoxIcon color="action" fontSize="small" />;
  }
}
