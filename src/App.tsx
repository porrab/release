import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./pages/Home/Home";
import PerformancePage from "./pages/Performance/ProductivityPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />}>
            <Route index element={<Navigate to="performance" replace />} />
            <Route index path="performance" element={<PerformancePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
