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
import DashboardView from "./component/DashboardView";
import type { ReleaseGroup } from "../../types/jira";
import axiosService from "../../api/axiosClient";
import jiraApi from "../../api/jiraApi";

export default function Home() {
  const dispatch = useAppDispatch();
  const { dashboardDetail, status, error } = useAppSelector(
    (state) => state.releases,
  );

  const [release, setRelease] = useState<ReleaseGroup[] | undefined>();

  const [selectedReleaseId, setSelectedReleaseId] = useState<string>(
    release[0].releaseId,
  );
  async function fetchRelease() {
    try {
      const allRelease = await jiraApi.getAllRelease();
      return allRelease;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(a () => {
    setRelease(await fetchRelease());
  }, []);

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
            >
              {RELEASES.map((release) => (
                <MenuItem key={release.id} value={release.id}>
                  {release.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Loading State */}
      {status === "loading" ? (
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
