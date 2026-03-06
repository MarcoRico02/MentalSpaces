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
    Lock, History,
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

      <NavItem to="/logs" icon={ClipboardList}>
        Registro de Auditoría
      </NavItem>

      <NavItem to="/locations" icon={Building}>
        Gestionar Locaciones
      </NavItem>

      <NavItem to="/rooms" icon={Building}>
        Gestionar Consultorios
      </NavItem>

      <NavItem to="/users" icon={Users}>
        Gestionar Usuarios
      </NavItem>

      <NavItem to="/config" icon={Settings}>
        Reglas de Reserva y Servicios
      </NavItem>

      <NavItem to="/trust-level" icon={ShieldCheck}>
        Niveles de Confianza
      </NavItem>

      <NavItem to="/monitoring" icon={Activity}>
        Monitoreo y Alertas
      </NavItem>

      <NavItem to="/bookings-rules" icon={Cog}>
        Reglas de Reserva (Completas)
      </NavItem>

      <NavItem to="/bookings" icon={Calendar}>
        Calendario
      </NavItem>

      <NavItem to="/reports" icon={BarChart3}>
        Reportes
      </NavItem>

      <NavItem to="/payments-record" icon={CreditCard}>
        Gestion subscripciones
      </NavItem>

      <NavItem to="" icon={History}>
        Historial de pagos
      </NavItem>

      <NavItem to="/access" icon={Lock}>
        Acceso
      </NavItem>
    </>
  );
};
