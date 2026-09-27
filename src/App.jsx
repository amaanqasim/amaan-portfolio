import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import AdminPage from "./components/admin/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin-portal" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
