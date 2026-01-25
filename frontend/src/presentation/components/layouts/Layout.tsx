import React from "react";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { AppLayout } from "./AppLayout";

export { AppLayout };

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <AppLayout>{children}</AppLayout>
    </div>
  );
};
