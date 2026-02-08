// AlertContext.tsx
import { Alert, Snackbar } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

export type AppAlert = {
  id: string;
  severity: "error" | "warning" | "info" | "success";
  message: string;
  autoHide?: number;
};

const AlertContext = createContext({
  push: (_a: Omit<AppAlert, "id">) => {},
});

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<AppAlert[]>([]);

  const push = (a: Omit<AppAlert, "id">) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setQueue((q) => [...q, { id, ...a }]);
  };

  const remove = (id: string) => setQueue((q) => q.filter((x) => x.id !== id));

  return (
    <AlertContext.Provider value={{ push }}>
      {children}
      {queue.map((a) => (
        <Snackbar
          key={a.id}
          open
          autoHideDuration={a.autoHide ?? 4000}
          onClose={() => remove(a.id)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => remove(a.id)}
            severity={a.severity}
            sx={{ width: "100%" }}
          >
            {a.message}
          </Alert>
        </Snackbar>
      ))}
    </AlertContext.Provider>
  );
}
