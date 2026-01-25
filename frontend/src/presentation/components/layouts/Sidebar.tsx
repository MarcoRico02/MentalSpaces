import React from "react";

import { BrandSection } from "./BrandSection";
import { NavigationMenu } from "./NavigationMenu";
import { AdminNavigation } from "./AdminNavigation";

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-72 bg-sidebar border-r border-sidebar-border p-4">
      <BrandSection />
      <NavigationMenu />
      <AdminNavigation />
    </aside>
  );
};
