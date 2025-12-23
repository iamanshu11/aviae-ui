import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default → Login */}
        <Route path="/" element={<Login />} />

        {/* Pharmacist Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin (separate flow) */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Redirect unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
