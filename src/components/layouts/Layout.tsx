import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
type LayoutProps = { children?: React.ReactNode };
export default function Layout({ children }: LayoutProps) {
  return (
    <Container sx={{ paddingTop: "20px", paddingBottom: "70px" }}>
      <Outlet></Outlet>
    </Container>
  );
}
