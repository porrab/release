import { Chip } from "@mui/material";

function Status({
  status,
  statusCategory,
}: {
  status: string;
  statusCategory: string;
}) {
  const colorMap: { [key: string]: "default" | "info" | "success" } = {
    new: "default",
    indeterminate: "info",
    done: "success",
  };

  return (
    <Chip
      label={status}
      size="small"
      variant="filled"
      color={colorMap[statusCategory] || "default"}
    />
  );
}
export default Status;
