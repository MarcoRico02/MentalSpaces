import React, { useState } from "react";
import {
    Activity,
    BarChart3,
    Building,
    Calendar,
    DollarSign,
    Users,
} from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Select,
    Tabs,
} from "../../components/ui";

const StatCard: React.FC<{
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
    trend?: string;
}> = ({ title, value, description, icon, trend }) => {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-sm text-gray-600">{title}</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
                        <div className="text-xs text-gray-500 mt-1">{description}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                        {icon}
                    </div>
                </div>
                {trend && (
                    <div className="mt-3 text-xs">
                        <span className="text-green-700">↑</span> {trend}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const ProgressBar: React.FC<{ value: number; max: number; color?: string }> = ({
                                                                                   value,
                                                                                   max,
                                                                                   color = "bg-blue-600",
                                                                               }) => {
    const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
    return (
        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
    );
};

export const MonitoringPage: React.FC = () => {
    const [tab, setTab] = useState("overview");

    return (
        <div className="space-y-6">
            <PageHeader
                title="Monitoreo y Métricas"
                description="Dashboard de monitoreo (maqueta)."
                right={<Button variant="secondary">Refrescar</Button>}
            />

            <Tabs
                value={tab}
                onValueChange={setTab}
                options={[
                    { value: "overview", label: "Resumen" },
                    { value: "users", label: "Usuarios" },
                    { value: "bookings", label: "Reservas" },
                    { value: "rooms", label: "Salas" },
                    { value: "alerts", label: "Alertas" },
                    { value: "reports", label: "Reportes" },
                ]}
            />

            {tab === "overview" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Usuarios Activos"
                            value="1,245"
                            description="Total registrados"
                            icon={<Users className="h-5 w-5" />}
                            trend="+4% vs mes anterior"
                        />
                        <StatCard
                            title="Reservas Hoy"
                            value="42"
                            description="En el día"
                            icon={<Calendar className="h-5 w-5" />}
                            trend="+8% vs ayer"
                        />
                        <StatCard
                            title="Ocupación"
                            value="68%"
                            description="Salas ocupadas"
                            icon={<Building className="h-5 w-5" />}
                            trend="+2%"
                        />
                        <StatCard
                            title="Ingresos del Mes"
                            value="$124,900"
                            description="MXN"
                            icon={<DollarSign className="h-5 w-5" />}
                            trend="+11%"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Gráficos (placeholder)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
                                    Área para charts (recharts o similar) — demo.
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Ocupación por sala</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {["Consultorio 1", "Consultorio 2", "Consultorio 3"].map((r, i) => (
                                    <div key={r} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700">{r}</span>
                                            <span className="text-gray-600">{60 + i * 10}%</span>
                                        </div>
                                        <ProgressBar value={60 + i * 10} max={100} color={i === 2 ? "bg-purple-600" : "bg-blue-600"} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {tab === "users" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Usuarios</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Select defaultValue="all">
                                <option value="all">Rol: Todos</option>
                                <option value="admin">Admin</option>
                                <option value="standard">Standard</option>
                                <option value="trusted">Trusted</option>
                                <option value="vip">VIP</option>
                            </Select>
                            <Select defaultValue="all">
                                <option value="all">Estado: Todos</option>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </Select>
                            <Button variant="secondary">Aplicar</Button>
                        </div>
                        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
                            Tabla de usuarios + gráfico de pastel (demo)
                        </div>
                    </CardContent>
                </Card>
            )}

            {tab === "bookings" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Reservas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
                            Tabla de reservas recientes + filtros + métricas (demo)
                        </div>
                    </CardContent>
                </Card>
            )}

            {tab === "rooms" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Salas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
                            Lista de salas, top salas, estado, ocupación (demo)
                        </div>
                    </CardContent>
                </Card>
            )}

            {tab === "alerts" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {["high", "medium", "low"].map((sev) => (
                        <Card key={sev}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Alerta {sev}
                                    <Badge variant={sev === "high" ? "danger" : sev === "medium" ? "warning" : "info"}>
                                        {sev}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-gray-600">
                                    Mensaje de alerta (demo). Timestamp · acción rápida · marcar como leída.
                                </div>
                                <div className="mt-3">
                                    <Button variant="secondary">Acción</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {tab === "reports" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Reportes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Select defaultValue="month">
                                <option value="today">Hoy</option>
                                <option value="week">Esta semana</option>
                                <option value="month">Este mes</option>
                                <option value="custom">Personalizado</option>
                            </Select>
                            <Select defaultValue="revenue">
                                <option value="revenue">Ingresos</option>
                                <option value="occupancy">Ocupación</option>
                                <option value="users">Usuarios</option>
                                <option value="bookings">Reservas</option>
                            </Select>
                            <Button>
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                        </div>
                        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
                            Exportación PDF/Excel/CSV (demo)
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};