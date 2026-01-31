import { useEffect, useState } from "react";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hook/hook";
import {
  fetchReleases,
  fetchDashboardByRelease,
} from "../../features/jira/jiraSlice";
import DashboardView from "./component/DashboardView";

export default function Home() {
  const dispatch = useAppDispatch();

  const { releaseList, dashboardDetail, status, error } = useAppSelector(
    (state) => state.releases,
  );
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>("");

  useEffect(() => {
    dispatch(fetchReleases());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedReleaseId && releaseList.length > 0) {
      setSelectedReleaseId(releaseList[0].id.toString());
    }
  }, [releaseList, selectedReleaseId]);

  useEffect(() => {
    if (selectedReleaseId) {
      dispatch(fetchDashboardByRelease(selectedReleaseId));
    }
  }, [dispatch, selectedReleaseId]);

  useEffect(() => {
    console.log(dashboardDetail);
  }, [dashboardDetail]);

  const handleChangeRelease = (event: any) => {
    setSelectedReleaseId(event.target.value);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Squad Performance
        </Typography>

        <Box minWidth={250}>
          <FormControl fullWidth size="small">
            <InputLabel>Select Release</InputLabel>
            <Select
              value={selectedReleaseId}
              label="Select Release"
              onChange={handleChangeRelease}
              disabled={status === "loading" && releaseList.length === 0}
            >
              {releaseList.map((release) => (
                <MenuItem key={release.id} value={release.id.toString()}>
                  {release.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {status === "loading" && !dashboardDetail ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Error: {error}</Alert>
      ) : dashboardDetail ? (
        <DashboardView data={dashboardDetail} />
      ) : (
        <Alert severity="info">Please select a release to view dashboard</Alert>
      )}
    </Container>
  );
}
