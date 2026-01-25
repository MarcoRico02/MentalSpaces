import React from "react";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  // Si no hay usuario, mostrar children sin layout (para login)
  if (!user) {
    return <>{children}</>;
  }

  // Si hay usuario, mostrar layout completo con sidebar y header
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - visible solo para usuarios autenticados */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - visible solo para usuarios autenticados */}
        <Header />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
