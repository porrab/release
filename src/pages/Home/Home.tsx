import { useEffect, useState } from "react";
import { Box, Typography, Container, FormControl, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hook/hook";
import type { ReleaseGroup } from "../../types/jira";
import { useAlert } from "../../components/AlertContext";
import ReleaseSelect from "./component/ReleaseSelect";
import { sortReleasesDesc } from "../../utils/releaseUtils";
import { Outlet, useNavigate } from "react-router-dom";
import {
  fetchAllReleases,
  setSelectedRelease,
  updateCurrentRelease,
} from "../../features/releaseSlice/releaseSlice";

import AppBottomNavigation from "./component/AppBottomNavigation";

export default function Home() {
  const dispatch = useAppDispatch();
  const { push } = useAlert();
  const [currentPage, setCurrentPage] = useState<number | string>(
    "performance",
  );

  const handleChange = (newValue: number | string) => {
    setCurrentPage(newValue);
    if (newValue === "performance") navigate("/performance");
    else if (newValue === "favorites") navigate("/test");
    else if (newValue === "nearby") navigate("/nearby");
  };
  const navigate = useNavigate();

  const {
    allReleases = [],
    status,
    selectedRelease,
  } = useAppSelector((state) => state.releases);

  const [loadingRelease, setLoadingRelease] = useState(false);

  // initial load of releases
  useEffect(() => {
    if (allReleases.length === 0 && status === "idle") {
      dispatch(fetchAllReleases())
        .unwrap()
        .catch((err: string) => {
          console.error("Caught error:", err);
          push({
            severity: "error",
            message: err || "Failed to load releases",
          });
        });
    }
  }, [dispatch, allReleases, status]);

  // when releases change, pick default
  useEffect(() => {
    if (allReleases.length > 0 && !selectedRelease) {
      const first = sortReleasesDesc(allReleases)[0];
      dispatch(setSelectedRelease(first));
    }
  }, [allReleases, selectedRelease, dispatch]);

  // handleSelect
  const handleSelect = (release: ReleaseGroup | null) => {
    dispatch(setSelectedRelease(release));
  };

  // refreshRelease
  const refreshRelease = async () => {
    try {
      setLoadingRelease(true);
      await dispatch(updateCurrentRelease()).unwrap();
      const releases = await dispatch(fetchAllReleases()).unwrap();
      push({ severity: "success", message: "Releases updated" });
      if (Array.isArray(releases) && releases.length > 0) {
        const sortedDesc = sortReleasesDesc(releases);
        dispatch(setSelectedRelease(sortedDesc[0]));
      }
    } catch (err: any) {
      push({ severity: "error", message: err || "Failed to refresh releases" });
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
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Overview
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Select a release to view summary data.
            </Typography>
          </Box>

          <FormControl sx={{ minWidth: 320 }}>
            <ReleaseSelect
              allReleases={allReleases}
              selectedReleaseName={selectedRelease?.releaseName || ""}
              loadingRelease={loadingRelease}
              status={status}
              onSelect={handleSelect}
              onRefresh={refreshRelease}
            />
          </FormControl>
        </Paper>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <AppBottomNavigation value={currentPage} onChange={handleChange} />
      </Box>

      <Outlet></Outlet>
    </Container>
  );
}
