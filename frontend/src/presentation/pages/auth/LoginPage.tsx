import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginForm } from "../../components/forms/LoginForm";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";

export const LoginPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect automatically if already authenticated
  React.useEffect(() => {
    if (user && !isLoading) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, location]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-app">
      {/* Login on the left */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>

      {/* Gradient and text on the right */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-primary/20 to-primary p-8 text-white flex items-center justify-center">
        <div className="max-w-md space-y-6">
          <h2 className="text-3xl font-bold">Welcome to SATI</h2>
          <p className="opacity-90">
            Platform for booking consultation rooms for mental health
            professionals.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-surface/20 p-2 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 7V3m8 4V3m-9 8h18v18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V11z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Easy Booking</h3>
                <p className="text-sm opacity-90">
                  Check availability and book consultation rooms in seconds.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-surface/20 p-2 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Comfortable Spaces</h3>
                <p className="text-sm opacity-90">
                  Equipped consultation rooms designed for psychology therapy.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-surface/20 p-2 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 9l2 2 4-4-6-4-6-2-2 2" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Security Guaranteed</h3>
                <p className="text-sm opacity-90">
                  Professional and confidential management of your bookings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
