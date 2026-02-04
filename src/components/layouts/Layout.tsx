import { Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
export default function Layout() {
  return (
    <Container sx={{ paddingTop: "20px", paddingBottom: "70px" }}>
      <CssBaseline />
      <Outlet></Outlet>
    </Container>
  );
}
