import React from "react";

import { BrandSection } from "./BrandSection";
import { NavigationMenu } from "./NavigationMenu";
import { AdminNavigation } from "./AdminNavigation";

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex w-72 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4">
        <BrandSection />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <NavigationMenu />
        <div className="my-3 h-px bg-sidebar-border" />
        <AdminNavigation />
      </nav>
    </aside>
  );
};
