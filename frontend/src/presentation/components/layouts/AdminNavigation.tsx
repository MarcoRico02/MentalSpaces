import React from "react";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { NavItem } from "./NavItem";
import {
  Users,
  Calendar,
  Settings,
  ClipboardList,
  Building,
  ShieldCheck,
  Activity,
  Cog,
  BarChart3,
  CreditCard,
  Lock,
} from "lucide-react";

export const AdminNavigation: React.FC = () => {
  const { user } = useAuth();

  if (
    !user ||
    (!user.usuarioInfoDTO.roles.includes("ADMIN") &&
      !user.usuarioInfoDTO.roles.includes("PROPIETARIO"))
  ) {
    return null;
  }

  return (
    <>
      <div className="mt-6 mb-2">
        <h3 className="text-xs uppercase font-semibold text-muted-foreground px-3">
          Administration
        </h3>
      </div>

      <NavItem to="/admin/logs" icon={ClipboardList}>
        Audit Logs
      </NavItem>

      <NavItem to="/admin/rooms" icon={Building}>
        Manage Rooms
      </NavItem>

      <NavItem to="/admin/users" icon={Users}>
        Manage Users
      </NavItem>

      <NavItem to="/admin/config" icon={Settings}>
        Booking Rules & Services
      </NavItem>

      <NavItem to="/admin/trust-level" icon={ShieldCheck}>
        Trust Levels
      </NavItem>

      <NavItem to="/admin/monitoring" icon={Activity}>
        Monitoring & Alerts
      </NavItem>

      <NavItem to="/admin/config-full" icon={Cog}>
        Booking Rules (Complete)
      </NavItem>

      <NavItem to="/admin/bookings" icon={Calendar}>
        Calendar
      </NavItem>

      <NavItem to="/admin/reports" icon={BarChart3}>
        Reports
      </NavItem>

      <NavItem to="/admin/payments" icon={CreditCard}>
        Payments
      </NavItem>

      <NavItem to="/admin/access" icon={Lock}>
        Access
      </NavItem>
    </>
  );
};
