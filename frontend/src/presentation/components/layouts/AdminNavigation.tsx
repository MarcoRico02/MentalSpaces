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
          Administración
        </h3>
      </div>

      <NavItem to="/admin/logs" icon={ClipboardList}>
        Registro de Auditoría
      </NavItem>

      <NavItem to="/locations" icon={Building}>
        Gestionar Locaciones
      </NavItem>

      <NavItem to="/admin/rooms" icon={Building}>
        Gestionar Consultorios
      </NavItem>

      <NavItem to="/admin/users" icon={Users}>
        Gestionar Usuarios
      </NavItem>

      <NavItem to="/admin/config" icon={Settings}>
        Reglas de Reserva y Servicios
      </NavItem>

      <NavItem to="/admin/trust-level" icon={ShieldCheck}>
        Niveles de Confianza
      </NavItem>

      <NavItem to="/admin/monitoring" icon={Activity}>
        Monitoreo y Alertas
      </NavItem>

      <NavItem to="/admin/config-full" icon={Cog}>
        Reglas de Reserva (Completas)
      </NavItem>

      <NavItem to="/admin/bookings" icon={Calendar}>
        Calendario
      </NavItem>

      <NavItem to="/admin/reports" icon={BarChart3}>
        Reportes
      </NavItem>

      <NavItem to="/admin/payments" icon={CreditCard}>
        Pagos
      </NavItem>

      <NavItem to="/admin/access" icon={Lock}>
        Acceso
      </NavItem>
    </>
  );
};
