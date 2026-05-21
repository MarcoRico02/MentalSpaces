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
  Building,
  CalendarDays,
} from "lucide-react";

export const NavigationMenu: React.FC = () => {
  return (
    <nav className="space-y-1">
      {/* Base Navigation */}
      <NavItem to="/dashboard" icon={Home}>
        Inicio
      </NavItem>

      <NavItem to="/my-bookings" icon={Calendar}>
        Mis Reservas
      </NavItem>

      <NavItem to="/profile" icon={FileText}>
        Mi Perfil
      </NavItem>

      <AuthenticatedNavigation />

      {/* Help */}
      <NavItem to="/chat" icon={HelpCircle}>
        Ayuda y Soporte
      </NavItem>

      <NavItem to="/booking-calendar-test" icon={CalendarDays}>
        Prueba Calendario
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
        Mis Documentos
      </NavItem>

      <NavItem to="/my-payments" icon={CreditCard}>
        Mis Pagos
      </NavItem>

      <NavItem to="/cubiculos" icon={Building}>
        Cubículos
      </NavItem>
    </>
  );
};
