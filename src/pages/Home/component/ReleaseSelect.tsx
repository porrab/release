import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import type { ReleaseGroup } from "../../../types/jira";
import { sortReleasesDesc } from "../../../utils/releaseUtils";

type Props = {
  allReleases: ReleaseGroup[];
  selectedReleaseName: string;
  loadingRelease: boolean;
  status: string;
  onSelect: (release: ReleaseGroup | null) => void;
  onRefresh: () => Promise<void> | void;
};

export default function ReleaseSelect({
  allReleases,
  selectedReleaseName,
  loadingRelease,
  status,
  onSelect,
  onRefresh,
}: Props) {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    const found = allReleases.find((r) => r.releaseName === value) || null;
    onSelect(found);
  };

  if (loadingRelease) {
    return (
      <Box>
        <Skeleton variant="text" width={140} height={28} sx={{ mb: 1 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          sx={{ borderRadius: 1 }}
        />
      </Box>
    );
  }

  const sorted = sortReleasesDesc(allReleases);

  return (
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
          onClick={onRefresh}
          disabled={loadingRelease || status === "loading"}
          size="medium"
          sx={{ mr: 1, p: 1, minWidth: 40, width: 40, height: 40 }}
          aria-label="refresh releases"
        >
          <Refresh />
        </IconButton>
      </Tooltip>

      <FormControl>
        <InputLabel id="release-select-label">Select Release</InputLabel>
        <Select
          labelId="release-select-label"
          value={selectedReleaseName || ""}
          label="Select Release"
          onChange={() => handleChange}
          sx={{ minWidth: 300 }}
          disabled={loadingRelease || status === "loading"}
        >
          {sorted.map((release) => (
            <MenuItem key={release.releaseId} value={release.releaseName}>
              {release.releaseName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
