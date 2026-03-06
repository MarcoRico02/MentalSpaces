import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading, hasRole } = useAuth();
  const location = useLocation();

  // If loading, show loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Acceso total para PROPIETARIO (mientras ADMIN no esté bien definido en la estructura)
  if (hasRole("PROPIETARIO")) {
    return <>{children}</>;
  }

  // If role required and doesn't have it, show access denied
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-default">Access Denied</h1>
          <p className="mt-2 text-secondary">
            You don't have permissions to access this page.
          </p>
        </div>
      </div>
    );
  }

  // If everything is ok, render children
  return <>{children}</>;
};
