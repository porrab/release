import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Paper,
  Skeleton,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hook/hook";
import {
  fetchAllReleases,
  fetchReleaseById,
  updateCurrentRelease,
} from "../../features/jira/jiraSlice";
import DashboardView from "./component/DashboardView";
import type { ReleaseGroup, PagedTickets } from "../../types/jira";
import { useAlert } from "../../components/AlertContext";
import { Refresh } from "@mui/icons-material";

export default function Home() {
  const dispatch = useAppDispatch();
  const [selectedRelease, setSelectedRelease] = useState<ReleaseGroup | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState<PagedTickets | undefined>();
  const [loadingRelease, setLoadingRelease] = useState(false);
  const { push } = useAlert();

  const {
    allReleases = [],
    dashboardDetail,
    status,
    error,
  } = useAppSelector((state) => state.releases);

  const extractNumbers = (text: string): string => {
    return text.replace(/[^0-9.]/g, "");
  };

  useEffect(() => {
    if (!allReleases) {
      dispatch(fetchAllReleases());
    }
  }, [dispatch]);

  useEffect(() => {
    if (allReleases.length > 0 && !selectedRelease) {
      const sortedDesc = [...allReleases].sort((a, b) =>
        b.releaseName.localeCompare(a.releaseName, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      );
      const first = sortedDesc[0];
      setSelectedRelease(first);

      const releaseNumber = extractNumbers(first.releaseName);
      if (releaseNumber) {
        dispatch(fetchReleaseById(releaseNumber))
          .unwrap()
          .then(() => {
            push({ severity: "success", message: "Load release success" });
          })
          .catch((err: string) => {
            push({
              severity: "error",
              message: err || "Failed to load release detail",
            });
          });
      }
    }
    if (selectedRelease) {
      const found = allReleases.find(
        (r) => r.releaseId === selectedRelease.releaseId,
      );
      if (!found) setSelectedRelease(null);
    }
  }, [allReleases, selectedRelease, dispatch, push]);

  useEffect(() => {
    if (dashboardDetail) {
      setCurrentPage(dashboardDetail);
    }
  }, [dashboardDetail]);

  const handleReleaseChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    const found = allReleases.find((r) => r.releaseName === value) || null;
    setSelectedRelease(found);
    if (found) {
      const releaseNumber = extractNumbers(found.releaseName);
      if (releaseNumber) {
        dispatch(fetchReleaseById(releaseNumber));
      }
    }
  };

  const refreshRelease = async () => {
    try {
      setLoadingRelease(true);
      await dispatch(updateCurrentRelease()).unwrap();
      const releases = await dispatch(fetchAllReleases()).unwrap();
      push({ severity: "success", message: "Releases updated" });
      if (Array.isArray(releases) && releases.length > 0) {
        const sortedDesc = [...releases].sort((a, b) =>
          b.releaseName.localeCompare(a.releaseName, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
        );
        setSelectedRelease(sortedDesc[0]);
      }
    } catch (err: any) {
      push({
        severity: "error",
        message: err?.toString() || "Failed to refresh releases",
      });
    } finally {
      setLoadingRelease(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box width="100%">
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            bgcolor: "#f8f9fa",
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Jira Release Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Select a release to view summary data and ticket status.
            </Typography>
          </Box>

          <FormControl sx={{ minWidth: 320 }}>
            {loadingRelease ? (
              <Box>
                <Skeleton
                  variant="text"
                  width={140}
                  height={28}
                  sx={{ mb: 1 }}
                />

                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={40}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "50%",
                  minWidth: 320,
                }}
              >
                <Tooltip title="Update Release">
                  <IconButton
                    onClick={refreshRelease}
                    disabled={loadingRelease || status === "loading"}
                    size="medium"
                    sx={{
                      mr: 1,
                      p: 1,
                      minWidth: 40,
                      width: 40,
                      height: 40,
                    }}
                    aria-label="refresh releases"
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <FormControl>
                  <InputLabel id="release-select-label">
                    Select Release
                  </InputLabel>
                  <Select
                    labelId="release-select-label"
                    value={selectedRelease?.releaseName || ""}
                    label="Select Release"
                    onChange={handleReleaseChange}
                    sx={{ minWidth: 300 }}
                    disabled={loadingRelease || status === "loading"}
                  >
                    {Array.isArray(allReleases) &&
                      [...allReleases]
                        .sort((a, b) =>
                          b.releaseName.localeCompare(
                            a.releaseName,
                            undefined,
                            {
                              numeric: true,
                              sensitivity: "base",
                            },
                          ),
                        )
                        .map((release) => (
                          <MenuItem
                            key={release.releaseId}
                            value={release.releaseName}
                          >
                            {release.releaseName}
                          </MenuItem>
                        ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </FormControl>
        </Paper>
      </Box>

      {status === "loading" && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          py={10}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Fetching release details...</Typography>
        </Box>
      )}

      {status === "failed" && (
        <Box py={5}>
          <Typography color="error" align="center">
            {error || "An error occurred while loading data."}
          </Typography>
        </Box>
      )}

      {status === "succeeded" && dashboardDetail && selectedRelease && (
        <DashboardView
          data={{
            releaseId: extractNumbers(selectedRelease.releaseName),
            releaseName: selectedRelease.releaseName || "not found",
            tickets: currentPage?.tickets || [],
            stats: {
              totalTicketCount: dashboardDetail.tickets?.length || 0,
              totalStoryPoints: (dashboardDetail.tickets || []).reduce(
                (sum, t) => sum + (t.storyPoints || 0),
                0,
              ),
              totalTimeSeconds: (dashboardDetail.tickets || []).reduce(
                (sum, t) => sum + (Number(t.timespent) || 0),
                0,
              ),
            },
          }}
        />
      )}

      {!selectedRelease && status !== "loading" && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={10}
          sx={{ color: "text.disabled" }}
        >
          <Typography variant="h6">
            Please select a release from the menu above to start.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
