import React from "react";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { NavItem } from "./NavItem";
import {
  Home,
  Calendar,
  HelpCircle,
  FileText,
  CreditCard,
  FileDown,
} from "lucide-react";

export const NavigationMenu: React.FC = () => {
  return (
    <nav className="space-y-1">
      {/* Base Navigation */}
      <NavItem to="/dashboard" icon={Home}>
        Inicio
      </NavItem>

      <NavItem to="/my-bookings" icon={Calendar}>
        My Bookings
      </NavItem>

      <NavItem to="/profile" icon={FileText}>
        My Profile
      </NavItem>

      <AuthenticatedNavigation />

      {/* Help */}
      <NavItem to="/chat" icon={HelpCircle}>
        Help & Support
      </NavItem>
    </nav>
  );
};

const AuthenticatedNavigation: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <NavItem to="/documents" icon={FileDown}>
        My Documents
      </NavItem>

      <NavItem to="/my-payments" icon={CreditCard}>
        My Payments
      </NavItem>
    </>
  );
};
