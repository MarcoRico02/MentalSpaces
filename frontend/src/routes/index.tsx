import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../core/aplicacion/hooks/useAuth";
import { AppLayout } from "../presentation/components/layouts/AppLayout";
import { ProtectedRoute } from "../presentation/components/common/ProtectedRoute";
import { LoginPage } from "../presentation/pages/auth/LoginPage";
import { DashboardPage } from "../presentation/pages/dashboard/DashboardPage";
import { LocationsPage } from "../presentation/pages/locations/LocationsPage";
import { CubiculosPage } from "../presentation/pages/cubiculos/CubiculosPage";
import { AccountSummaryPage } from "../presentation/pages/account/AccountSummaryPage";
import { AccountHistoryPage } from "../presentation/pages/account/AccountHistoryPage";
import {
  PaymentsPage,
  AdminPaymentsPage,
} from "../presentation/pages/account/PaymentsPage";
import { FaqPage } from "../presentation/pages/faq/FaqPage";
import { SettingsPage } from "../presentation/pages/settings/SettingsPage";
import { NotFoundPage } from "../presentation/pages/not-found/NotFoundPage";
import { DocumentsPage } from "../presentation/pages/documents/DocumentsPage";
import { ChatPage } from "../presentation/pages/chat/ChatPage";
import { MyBookingsPage } from "../presentation/pages/bookings/MyBookingsPage";
import { NewBookingPage } from "../presentation/pages/bookings/NewBookingPage";
import { BookingsPage } from "../presentation/pages/bookings/BookingsPage";
import { RoomsPage } from "../presentation/pages/rooms/RoomsPage";
import { RoomDetailsPage } from "../presentation/pages/rooms/RoomDetailsPage";
import { ProfilePage } from "../presentation/pages/profile/ProfilePage";
import { TutorialPage } from "../presentation/pages/tutorial/TutorialPage";
import { TherapistsPage } from "../presentation/pages/therapists/TherapistsPage";
import { TherapistProfilePage } from "../presentation/pages/therapists/TherapistProfilePage";
import { SystemConfigPage } from "../presentation/pages/system/SystemConfigPage";

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
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />

        {/* Aliases / compat */}
        <Route path="/my-payments" element={<Navigate to="/payments" replace />} />
        <Route path="/account-settings" element={<Navigate to="/settings" replace />} />

        {/* Public pages */}
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/tutorial" element={<TutorialPage />} />

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
          path="/account-summary"
          element={
            <ProtectedRoute>
              <AccountSummaryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account-history"
          element={
            <ProtectedRoute>
              <AccountHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
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

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* Alias: equivalente semántico */}
        <Route
          path="/bookings/mine"
          element={<Navigate to="/my-bookings" replace />}
        />

        <Route
          path="/new-booking"
          element={
            <ProtectedRoute>
              <NewBookingPage />
            </ProtectedRoute>
          }
        />

        {/* Alias: edición via query param (documento) */}
        <Route
          path="/edit-booking"
          element={<Navigate to="/new-booking" replace />}
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />

        {/* Alias: calendario admin existente */}
        <Route path="/admin/bookings" element={<Navigate to="/bookings" replace />} />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <RoomsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms/:id"
          element={
            <ProtectedRoute>
              <RoomDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/therapists"
          element={
            <ProtectedRoute>
              <TherapistsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/therapist-profile"
          element={
            <ProtectedRoute>
              <TherapistProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/system-config"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <SystemConfigPage />
            </ProtectedRoute>
          }
        />

        {/* Rutas admin eliminadas (carpeta admin removida) */}
        {/* Se conserva /admin/payments porque vive en PaymentsPage.tsx */}

        {/* ELIMINAR TODO ESTE BLOQUE DE RUTAS:
            /admin/access
            /admin/bookings-list
            /admin/config
            /admin/config-full
            /admin/users
            /admin/users-list
            /admin/logs
            /admin/monitoring
            /admin/rooms
            /admin/rooms-management
            /admin/trust-level-rules
            /admin/trust-level
        */}

        {/* Redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
};
