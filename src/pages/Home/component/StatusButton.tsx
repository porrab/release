import { Chip } from "@mui/material";

interface StatusProps {
  status: string;
}
export default function StatusButton({ status }: StatusProps) {
  return (
    <Chip
      sx={{ width: 25, height: 25 }}
      color={status === "Release" ? "success" : "error"}
    ></Chip>
  );
}
