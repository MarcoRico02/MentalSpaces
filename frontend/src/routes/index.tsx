import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../core/aplicacion/hooks/useAuth";
import { AppLayout } from "../presentation/components/layouts/AppLayout";
import { ProtectedRoute } from "../presentation/components/common/ProtectedRoute";
import { LoginPage } from "../presentation/pages/auth/LoginPage";
import { DashboardPage } from "../presentation/pages/dashboard/DashboardPage";
import { LocationsPage } from "../presentation/pages/locations/LocationsPage";
import { BuscarCubiculosPage } from "../presentation/pages/cubiculos/BuscarCubiculosPage";
import { AccountSummaryPage } from "../presentation/pages/account/AccountSummaryPage";
import { AccountHistoryPage } from "../presentation/pages/account/AccountHistoryPage";
import {PaymentsPage} from "../presentation/pages/account/PaymentsPage";
import { FaqPage } from "../presentation/pages/faq/FaqPage";
import { FaqManagementPage } from "../presentation/pages/faq/FaqManagementPage";
import { SettingsPage } from "../presentation/pages/settings/SettingsPage";
import { NotFoundPage } from "../presentation/pages/not-found/NotFoundPage";
import { DocumentsPage } from "../presentation/pages/documents/DocumentsPage";
import { ChatPage } from "../presentation/pages/chat/ChatPage";
import { NewBookingPage } from "../presentation/pages/bookings/NewBookingPage";
import { BookingsPage } from "../presentation/pages/bookings/BookingsPage";
import { RoomsPage } from "../presentation/pages/rooms/RoomsPage";
import { ProfilePage } from "../presentation/pages/profile/ProfilePage";
import { TutorialPage } from "../presentation/pages/tutorial/TutorialPage";
import { TherapistsPage } from "../presentation/pages/therapists/TherapistsPage";
import { TherapistProfilePage } from "../presentation/pages/therapists/TherapistProfilePage";
import { SystemConfigPage } from "../presentation/pages/system/SystemConfigPage";
import { UsersListPage } from "../presentation/pages/users/UsersManagementPage";
import { LogsPage } from "../presentation/pages/logs/LogsPage";
import { MonitoringPage} from "@/presentation/pages/system/SystemMonitoringPage.tsx";
import { TrustLevelPage} from "@/presentation/pages/trust-level/TrustLevelPage.tsx";
import { SubscriptionManagementPage } from "../presentation/pages/account/SubscriptionManagementPage";
import { BookingCalendarPage } from "../presentation/pages/bookings/BookingCalendarPage";
import { MyAppointmentsPage } from "../presentation/pages/bookings/MyAppointmentsPage";

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

        {/* FAQ Management (Admin only) */}
        <Route
          path="/faq-management"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <FaqManagementPage />
            </ProtectedRoute>
          }
        />

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
          path="/payments-record"
          element={
            <ProtectedRoute>
              <SubscriptionManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Logs de auditoría (reorganizado) */}
        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <LogsPage />
            </ProtectedRoute>
          }
        />

        {/* Configuraciones (usado por el menú) */}
        <Route
          path="/config"
          element={
          <ProtectedRoute>
            <SystemConfigPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings-rules"
          element={
            <ProtectedRoute>
                <SystemConfigPage />
            </ProtectedRoute>
          }
        />

        {/* Usuarios (alias usado por el menú) */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersListPage />
            </ProtectedRoute>
          }
        />

        {/* Compat legacy /admin/* */}
        <Route path="/logs"
               element={
                    <ProtectedRoute>
                        <LogsPage />
                    </ProtectedRoute>
               } />
        <Route path="/users"
               element={
                    <ProtectedRoute>
                        <UsersListPage />
                    </ProtectedRoute>
               } />

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
              <BuscarCubiculosPage />
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
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
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
          path="/booking-calendar"
          element={
            <ProtectedRoute>
              <BookingCalendarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <RoomsPage />
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
            <ProtectedRoute>
              <SystemConfigPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users-management"
          element={
            <ProtectedRoute>
              <UsersListPage />
            </ProtectedRoute>
          }
        />

        <Route
            path="/monitoring"
            element={
                <ProtectedRoute>
                    <MonitoringPage />
                </ProtectedRoute>
            }
        />

        <Route
            path="/trust-level"
            element={
                <ProtectedRoute>
                    <TrustLevelPage />
                </ProtectedRoute>
            }
        />

        {/* Redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
};
