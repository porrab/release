import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Stack,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/system";

export interface FilterTicket {
  releaseNumber: string;
  versionName: string[];
  project: string[];
  workStream: string[];
  status: string[];
  type: string[];
  squad: string[];
}

type Options = {
  versionName?: string[];
  project?: string[];
  workStream?: string[];
  status?: string[];
  type?: string[];
  squad?: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: FilterTicket) => void;
  initialValues?: Partial<FilterTicket>;
  options?: Options;
  sx?: SxProps<Theme>;
};

const modalStyle: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 760,
  maxWidth: "95vw",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
};

const emptyPayload = (): FilterTicket => ({
  releaseNumber: "",
  versionName: [],
  project: [],
  workStream: [],
  status: [],
  type: [],
  squad: [],
});

const ImportFilterModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  options,
  sx,
}) => {
  const [values, setValues] = useState<FilterTicket>(() => ({
    ...emptyPayload(),
    ...(initialValues ?? {}),
  }));

  useEffect(() => {
    if (open) {
      setValues({
        ...emptyPayload(),
        ...(initialValues ?? {}),
      });
    }
  }, [open, initialValues]);

  const handleChange = <K extends keyof FilterTicket>(
    key: K,
    value: FilterTicket[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  const isSubmitDisabled = values.releaseNumber.trim() === "";

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="import-filter-modal">
      <Box sx={{ ...modalStyle, ...(sx as object) }}>
        <Typography id="import-filter-modal" variant="h6" gutterBottom>
          Import Filters
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Release Number"
            value={values.releaseNumber}
            onChange={(e) => handleChange("releaseNumber", e.target.value)}
            fullWidth
            size="small"
            required
          />

          <Autocomplete
            multiple
            freeSolo
            options={options?.versionName ?? []}
            value={values.versionName}
            onChange={(_, v) => handleChange("versionName", v)}
            renderInput={(params) => (
              <TextField {...params} label="Version Name" size="small" />
            )}
          />

          <Autocomplete
            multiple
            freeSolo
            options={options?.project ?? []}
            value={values.project}
            onChange={(_, v) => handleChange("project", v)}
            renderInput={(params) => (
              <TextField {...params} label="Project" size="small" />
            )}
          />

          <Autocomplete
            multiple
            freeSolo
            options={options?.workStream ?? []}
            value={values.workStream}
            onChange={(_, v) => handleChange("workStream", v)}
            renderInput={(params) => (
              <TextField {...params} label="Work Stream" size="small" />
            )}
          />

          <Autocomplete
            multiple
            freeSolo
            options={options?.status ?? []}
            value={values.status}
            onChange={(_, v) => handleChange("status", v)}
            renderInput={(params) => (
              <TextField {...params} label="Status" size="small" />
            )}
          />

          <Autocomplete
            multiple
            freeSolo
            options={options?.type ?? []}
            value={values.type}
            onChange={(_, v) => handleChange("type", v)}
            renderInput={(params) => (
              <TextField {...params} label="Type" size="small" />
            )}
          />

          <Autocomplete
            multiple
            freeSolo
            options={options?.squad ?? []}
            value={values.squad}
            onChange={(_, v) => handleChange("squad", v)}
            renderInput={(params) => (
              <TextField {...params} label="Squad" size="small" />
            )}
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end" mt={1}>
            <Button
              variant="outlined"
              onClick={() => {
                setValues({ ...emptyPayload(), ...(initialValues ?? {}) });
              }}
            >
              Reset
            </Button>
            <Button variant="text" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              Import
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ImportFilterModal;
