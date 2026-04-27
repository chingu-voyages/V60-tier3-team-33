import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { InsightsPage } from "./pages/InsightsPage";
import Dashboard from "./pages/Dashboard";
import Boards from "./pages/Boards";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/boards/:status" element={<Boards />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/account" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
