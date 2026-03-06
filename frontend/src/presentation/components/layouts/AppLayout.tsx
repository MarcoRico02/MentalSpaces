import React from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNavigation } from "./MobileNavigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Caso A (según spec): no hay usuario y NO estás en /auth
  if (!user && location.pathname !== "/auth") {
    return <>{children}</>;
  }

  // Caso B (según spec): pantalla /auth siempre sin layout
  if (location.pathname === "/auth") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      {/* Header no es fixed en este proyecto, no necesitamos spacer. */}

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto pb-16 md:pb-6">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
};
