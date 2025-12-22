import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default → Login */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Redirect unknown URLs back to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
