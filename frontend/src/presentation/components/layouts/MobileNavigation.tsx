import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, CalendarCheck, FileText, HelpCircle, Settings } from "lucide-react";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const items: Item[] = [
  { to: "/dashboard", label: "Inicio", icon: Home },
  { to: "/my-bookings", label: "Reservas", icon: CalendarCheck },
  { to: "/profile", label: "Perfil", icon: FileText },
  { to: "/chat", label: "Ayuda", icon: HelpCircle },
  { to: "/settings", label: "Ajustes", icon: Settings },
];

export const MobileNavigation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;
  if (location.pathname === "/auth" || location.pathname === "/login") return null;

  const itemBase =
    "flex flex-col items-center justify-center text-xs select-none rounded-md cursor-pointer transition-colors duration-150";
  const itemIdle =
    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent/70";
  const itemActive = "bg-sidebar-primary text-sidebar-primary-foreground";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={
                itemBase +
                " focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 " +
                (active ? itemActive : itemIdle)
              }
            >
              <Icon className="h-5 w-5" />
              <span className="mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
