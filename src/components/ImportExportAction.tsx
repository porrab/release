
import React from "react";
import { Box, Button, type SxProps, type Theme } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";

type Props = {
  onImport?: () => void;
  onExport?: () => void;

  importDisabled?: boolean;
  exportDisabled?: boolean;

  sx?: SxProps<Theme>;

  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
};

const ImportExportActions: React.FC<Props> = ({
  onImport,
  onExport,
  importDisabled = false,
  exportDisabled = false,
  sx,
  variant = "contained",
  size = "medium",
}) => {
  return (
    <Box
      height={1}
      sx={{
        display: "flex",
        gap: 3,
        alignItems: "center",
        ...((sx as object) ?? {}),
      }}
    >
      <Button
        variant={variant}
        startIcon={<DownloadIcon />}
        onClick={onImport}
        disabled={importDisabled}
        size={size}
        aria-label="Import"
      >
        Import
      </Button>

      <Button
        variant={variant}
        startIcon={<UploadIcon />}
        onClick={onExport}
        disabled={exportDisabled}
        size={size}
        aria-label="Export"
      >
        Export
      </Button>
    </Box>
  );
};

export default ImportExportActions;
