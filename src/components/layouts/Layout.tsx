import { Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AlertProvider } from "../AlertContext";

export default function Layout() {
  return (
    <AlertProvider>
      <Container sx={{ paddingTop: "20px", paddingBottom: "70px" }}>
        <CssBaseline />
        <Outlet />
      </Container>
    </AlertProvider>
  );
}
