import { Paper, Typography } from "@mui/material";

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) => (
  <Paper
    sx={{ p: 2, height: "100%", borderLeft: `5px solid ${color}` }}
    elevation={2}
  >
    <Typography variant="subtitle2" color="textSecondary">
      {title}
    </Typography>
    <Typography variant="h4" fontWeight="bold">
      {value}
    </Typography>
  </Paper>
);

export default StatCard;
