import React from "react";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";

export const DashboardPage: React.FC = () => {
  const { user, isPsicologo, isPropietario } = useAuth();

  return (
    <div className="space-y-6">
      {/* Personalized greeting */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Hola, {user?.usuarioInfoDTO.fullName}!
        </h1>
        <p className="text-gray-600 mt-2">
          {isPsicologo()
            ? "Panel de control para psicólogos"
            : isPropietario()
              ? "Panel de control para propietarios"
              : "Panel de control general"}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 border-b-2 border-gray-200"
              >
                <path d="m3 9 9-7 9v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Appointments Today
              </p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 border-b-2 border-gray-200"
              >
                <path d="M17 20h5v-2a4 4 0 0 0 1-2 2H5a2 2 0 0 1-2 2z" />
                <polyline points="17 20h5v-2a4 4 0 0 0 1-2 2H5a2 2 0 0 1-2 2z" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Patients</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 border-b-2 border-gray-200"
              >
                <path d="m3 9 9-7 9v11a2 2 0 0 0 1-2 2H5a2 2 0 0 1-2 2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Consulting Rooms
              </p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 border-b-2 border-gray-200"
              >
                <path d="M12 9v2m0 6h4m-6 4-6h4m0 6 4-6h4m0 6 4-6H6a6 4 0 6 4h-6 0 6 4 0 6-4 0 6 6z" />
                <path d="M5 20h14a11 11 0 0 1-5 5h11a11 0 0 1-5 5 0 0 0 1-5 5z" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Income This Month
              </p>
              <p className="text-2xl font-bold text-gray-900">$45.2k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions specific by role */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isPsicologo() && (
            <>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                New Appointment
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                View Patients
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                History
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                Configuration
              </button>
            </>
          )}

          {isPropietario() && (
            <>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Manage Rooms
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                View Bookings
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                Reports
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                Settings
              </button>
            </>
          )}

          {!isPsicologo() && !isPropietario() && (
            <>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Appointments
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Consulting Rooms
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                Users
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                Settings
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
