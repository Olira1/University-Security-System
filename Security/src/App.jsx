import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AlertProvider } from "./context/AlertContext.jsx";

// Pages
import Home from "./pages/Home.jsx";
import PoliceDashboard from "./pages/police/PoliceDashboard.jsx";
import Login from "./pages/admin/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import LiveScan from "./pages/admin/LiveScan.jsx";
import VisitorManagement from "./pages/admin/VisitorManagement.jsx";
import ScanLogs from "./pages/admin/ScanLogs.jsx";
import Alerts from "./pages/admin/Alerts.jsx";

// Protected Route Component
// TODO: Re-enable authentication after testing
const ProtectedRoute = ({ children }) => {
  // TEMPORARILY DISABLED FOR TESTING - uncomment below to re-enable
  // const token = localStorage.getItem("auth_token");
  // if (!token) {
  //   return <Navigate to="/admin/login" replace />;
  // }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />

            {/* Police Portal - Public */}
            <Route path="/police" element={<PoliceDashboard />} />

            {/* Admin Portal - Public */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin Portal - Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/livescan"
              element={
                <ProtectedRoute>
                  <LiveScan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/visitor-management"
              element={
                <ProtectedRoute>
                  <VisitorManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/scan-logs"
              element={
                <ProtectedRoute>
                  <ScanLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/alerts"
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
