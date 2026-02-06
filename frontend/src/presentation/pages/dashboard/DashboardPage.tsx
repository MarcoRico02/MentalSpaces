import React from "react";
import { BarChart3, CalendarDays, CreditCard, Settings, Users } from "lucide-react";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { PageHeader } from "../../components/common/PageHeader";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TBody,
  TD,
  THead,
  TH,
  TR,
} from "../../components/ui";

type Stat = {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
};

type ActivityRow = {
  label: string;
  detail: string;
  when: string;
  status: "ok" | "pending" | "warning";
};

export const DashboardPage: React.FC = () => {
  const { user, isPsicologo, isPropietario } = useAuth();

  const roleLabel = isPsicologo()
    ? "Psicólogo"
    : isPropietario()
      ? "Propietario"
      : "Administrador";

  const stats: Stat[] = isPsicologo()
    ? [
        {
          label: "Citas hoy",
          value: "3",
          hint: "Confirmadas",
          icon: <CalendarDays className="h-5 w-5" />,
        },
        {
          label: "Pacientes activos",
          value: "18",
          hint: "Últimos 30 días",
          icon: <Users className="h-5 w-5" />,
        },
        {
          label: "Reservas pendientes",
          value: "1",
          hint: "Requieren acción",
          icon: <CalendarDays className="h-5 w-5" />,
        },
        {
          label: "Pagos por confirmar",
          value: "$450",
          hint: "Última semana",
          icon: <CreditCard className="h-5 w-5" />,
        },
      ]
    : isPropietario()
      ? [
          {
            label: "Ocupación hoy",
            value: "68%",
            hint: "Promedio",
            icon: <BarChart3 className="h-5 w-5" />,
          },
          {
            label: "Reservas hoy",
            value: "14",
            hint: "Confirmadas + pendientes",
            icon: <CalendarDays className="h-5 w-5" />,
          },
          {
            label: "Salas activas",
            value: "8",
            hint: "En operación",
            icon: <Settings className="h-5 w-5" />,
          },
          {
            label: "Ingresos estimados",
            value: "$45.2k",
            hint: "Este mes",
            icon: <CreditCard className="h-5 w-5" />,
          },
        ]
      : [
          {
            label: "Usuarios activos",
            value: "1,245",
            hint: "Registrados",
            icon: <Users className="h-5 w-5" />,
          },
          {
            label: "Pagos pendientes",
            value: "8",
            hint: "Revisar",
            icon: <CreditCard className="h-5 w-5" />,
          },
          {
            label: "Reservas hoy",
            value: "42",
            hint: "Sistema",
            icon: <CalendarDays className="h-5 w-5" />,
          },
          {
            label: "Alertas",
            value: "3",
            hint: "Críticas",
            icon: <BarChart3 className="h-5 w-5" />,
          },
        ];

  const activity: ActivityRow[] = isPsicologo()
    ? [
        {
          label: "Reserva creada",
          detail: "Consultorio 3 · 10:00–11:00",
          when: "Hoy 09:12",
          status: "ok",
        },
        {
          label: "Pago pendiente",
          detail: "BK-1201 · $450.00",
          when: "Ayer 18:40",
          status: "pending",
        },
        {
          label: "Documento en revisión",
          detail: "Título profesional",
          when: "Hace 2 días",
          status: "warning",
        },
      ]
    : isPropietario()
      ? [
          {
            label: "Reserva confirmada",
            detail: "Consultorio 1 · 12:00–13:00",
            when: "Hoy 10:05",
            status: "ok",
          },
          {
            label: "Solicitud de cancelación",
            detail: "BK-1210 · Sede Roma",
            when: "Hoy 09:40",
            status: "pending",
          },
          {
            label: "Sala marcada inactiva",
            detail: "Consultorio 6",
            when: "Hace 1 día",
            status: "warning",
          },
        ]
      : [
          {
            label: "Pago fallido",
            detail: "PAY-1004 · Stripe",
            when: "Hoy 08:30",
            status: "warning",
          },
          {
            label: "Nuevo usuario",
            detail: "Dra. Laura López",
            when: "Ayer 20:10",
            status: "ok",
          },
          {
            label: "Log crítico",
            detail: "/api/bookings · CRITICAL",
            when: "Ayer 19:48",
            status: "pending",
          },
        ];

  const statusBadge = (s: ActivityRow["status"]) => {
    if (s === "ok") return <Badge variant="success">OK</Badge>;
    if (s === "pending") return <Badge variant="warning">Pendiente</Badge>;
    return <Badge variant="danger">Atención</Badge>;
  };

  const quickActions = isPsicologo()
    ? [
        { label: "Nueva reserva", href: "/new-booking" },
        { label: "Mis reservas", href: "/my-bookings" },
        { label: "Pagos", href: "/payments" },
        { label: "Mi perfil", href: "/profile" },
      ]
    : isPropietario()
      ? [
          { label: "Calendario", href: "/bookings" },
          { label: "Salas", href: "/admin/rooms" },
          { label: "Pagos (admin)", href: "/admin/payments" },
          { label: "Configuración", href: "/settings" },
        ]
      : [
          { label: "Monitoreo", href: "/admin/monitoring" },
          { label: "Usuarios", href: "/admin/users-list" },
          { label: "Pagos", href: "/admin/payments" },
          { label: "Logs", href: "/admin/logs" },
        ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Resumen de actividad · Rol: ${roleLabel}`}
        right={
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Refrescar
          </Button>
        }
      />

      <Card>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm text-gray-600">Bienvenido</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                {user?.usuarioInfoDTO?.fullName ? (
                  <>¡Hola, {user.usuarioInfoDTO.fullName}!</>
                ) : (
                  "¡Hola!"
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {isPsicologo()
                  ? "Panel de control para psicólogos"
                  : isPropietario()
                    ? "Panel de control para propietarios"
                    : "Panel de control administrativo"}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">UI-only</Badge>
              <Badge variant="info">Auto-refresh (demo)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-600">{s.label}</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {s.value}
                  </div>
                  {s.hint && <div className="text-xs text-gray-500 mt-1">{s.hint}</div>}
                </div>
                {s.icon && (
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                    {s.icon}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Últimos eventos relevantes para tu rol (maqueta).
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Evento</TH>
                  <TH>Detalle</TH>
                  <TH>Cuándo</TH>
                  <TH>Estado</TH>
                </TR>
              </THead>
              <TBody>
                {activity.map((a, idx) => (
                  <TR key={idx}>
                    <TD className="font-medium text-gray-900">{a.label}</TD>
                    <TD>{a.detail}</TD>
                    <TD>{a.when}</TD>
                    <TD>{statusBadge(a.status)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Navegación directa (solo UI).
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((a) => (
              <Button
                key={a.href}
                className="w-full justify-start"
                variant="secondary"
                onClick={() => (window.location.href = a.href)}
              >
                {a.label}
              </Button>
            ))}

            <div className="pt-3 text-xs text-gray-500">
              Nota: rutas admin requieren rol ADMIN (ProtectedRoute). En esta maqueta
              no se ejecutan endpoints.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
