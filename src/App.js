import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, AdminRoute, PublicRoute } from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import Dashboard from "./components/dashboard/Dashboard";
import LeadsPage from "./components/leads/LeadsPage";
import TasksPage from "./components/tasks/TasksPage";
import AdminPanel from "./components/admin/AdminPanel";
import { Toaster } from "react-hot-toast";

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><Layout><LeadsPage /></Layout></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Layout><TasksPage /></Layout></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/admin" element={<AdminRoute><Layout><AdminPanel /></Layout></AdminRoute>} />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "10px", background: "#1e293b", color: "#f8fafc", fontSize: "14px" },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
