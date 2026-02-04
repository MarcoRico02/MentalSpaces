import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../core/aplicacion/hooks/useAuth";
import { AppLayout } from "../presentation/components/layouts/AppLayout";
import { ProtectedRoute } from "../presentation/components/common/ProtectedRoute";
import { LoginPage } from "../presentation/pages/auth/LoginPage";
import { DashboardPage } from "../presentation/pages/dashboard/DashboardPage";
import { LocationsPage } from "../presentation/pages/locations/LocationsPage";
import { CubiculosPage } from "../presentation/pages/cubiculos/CubiculosPage";

export const AppRoutes: React.FC = () => {
  const { isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AppLayout>
      {/* Public Routes */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/locations"
          element={
            <ProtectedRoute>
              <LocationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cubiculos"
          element={
            <ProtectedRoute>
              <CubiculosPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
};
