import { Box, CircularProgress, Typography, Button } from "@mui/material";

type Props = {
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
  loadingMessage?: string;
  onRetry?: () => void;
};

export default function StatusView({
  status,
  error,
  loadingMessage = "Loading...",
  onRetry,
}: Props) {
  if (status === "loading") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        py={10}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>{loadingMessage}</Typography>
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box py={5} textAlign="center">
        <Typography color="error">
          {error || "An error occurred while loading data."}
        </Typography>
        {onRetry && (
          <Box mt={2}>
            <Button variant="contained" onClick={onRetry}>
              Retry
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  return null;
}
