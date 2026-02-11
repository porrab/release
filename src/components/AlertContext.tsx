import { Alert, Snackbar } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

export type AppAlert = {
  id: string;
  severity: "error" | "warning" | "info" | "success";
  message: string;
  autoHide?: number;
};

interface AlertContextType {
  push: (a: Omit<AppAlert, "id">) => void;
}

const AlertContext = createContext<AlertContextType>({
  push: () => {},
});

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AppAlert | null>(null);

  const push = (a: Omit<AppAlert, "id">) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setAlert({ id, ...a });
  };

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ push }}>
      {children}
      {alert && (
        <Snackbar
          key={alert.id}
          open={!!alert}
          autoHideDuration={alert.autoHide ?? 4000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={alert.severity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </AlertContext.Provider>
  );
}
