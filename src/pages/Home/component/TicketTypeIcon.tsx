import BugReportIcon from "@mui/icons-material/BugReport";
import BuildIcon from "@mui/icons-material/Build";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { Tooltip } from "@mui/material";

interface TicketTypeIconProps {
  type: string;
  description?: string;
}

export default function TicketTypeIcon({ type }: TicketTypeIconProps) {
  let element;
  switch (type) {
    case "Bug":
      element = <BugReportIcon color="error" fontSize="small" />;
      break;
    case "Story":
      element = <AutoStoriesIcon color="success" fontSize="small" />;
      break;
    case "Task":
      element = <BuildIcon color="primary" fontSize="small" />;
      break;
    case "Sub-task":
      element = <CheckBoxIcon color="action" fontSize="small" />;
      break;
    default:
      element = <CheckBoxIcon color="action" fontSize="small" />;
  }
  return <Tooltip title={type}>{element}</Tooltip>;
}
