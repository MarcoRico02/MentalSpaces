import React, { useMemo, useState } from "react";
import {
    AlertCircle,
    ArrowDownCircle,
    ArrowUpCircle,
    Award,
    BadgeCheck,
    CheckCircle2,
    History,
    Shield,
    UserPlus,
    X,
} from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Dialog,
    Input,
    Label,
    Select,
    Switch,
    Tabs,
    Textarea,
    Table,
    TBody,
    TD,
    THead,
    TH,
    TR,
} from "../../components/ui";

type Role = "standard" | "trusted" | "vip" | "admin";

type DocStatus = "none" | "pending" | "approved" | "rejected";

type UserRow = {
    id: number;
    fullName: string;
    username: string;
    email: string;
    role: Role;
    trustLevel: "standard" | "trusted" | "vip";
    docStatus: DocStatus;
    active: boolean;
    lastActivity: string;
};

export const UsersListPage: React.FC = () => {
    const [tab, setTab] = useState("users");
    const [search, setSearch] = useState("");

    const [docOpen, setDocOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);

    const users: UserRow[] = [
        {
            id: 1,
            fullName: "Dra. Sofía Hernández",
            username: "sofia",
            email: "sofia@sati.mx",
            role: "trusted",
            trustLevel: "trusted",
            docStatus: "approved",
            active: true,
            lastActivity: "Hoy 10:20",
        },
        {
            id: 2,
            fullName: "Dr. Rodrigo Rodríguez",
            username: "drrodriguez",
            email: "rodrigo@sati.mx",
            role: "vip",
            trustLevel: "vip",
            docStatus: "pending",
            active: true,
            lastActivity: "Ayer 18:10",
        },
        {
            id: 3,
            fullName: "Usuario Standard",
            username: "user1",
            email: "user1@sati.mx",
            role: "standard",
            trustLevel: "standard",
            docStatus: "none",
            active: true,
            lastActivity: "Hace 3 días",
        },
        {
            id: 4,
            fullName: "Admin SATI",
            username: "admin",
            email: "admin@sati.mx",
            role: "admin",
            trustLevel: "standard",
            docStatus: "approved",
            active: true,
            lastActivity: "Hoy 09:00",
        },
    ];

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        const sorted = [...users].sort((a, b) => a.fullName.localeCompare(b.fullName));
        return sorted.filter((u) => {
            if (!term) return true;
            return (
                u.fullName.toLowerCase().includes(term) ||
                u.username.toLowerCase().includes(term)
            );
        });
    }, [search]);

    const roleVariant = (r: Role) => {
        if (r === "admin") return "danger";
        if (r === "vip") return "warning";
        if (r === "trusted") return "info";
        return "outline";
    };

    const docVariant = (s: DocStatus) => {
        if (s === "approved") return "success";
        if (s === "pending") return "warning";
        if (s === "rejected") return "danger";
        return "outline";
    };

    const trustBadge = (t: UserRow["trustLevel"]) => {
        if (t === "vip") {
            return (
                <span className="inline-flex items-center gap-1">
          <Award className="h-4 w-4" /> VIP
        </span>
            );
        }
        if (t === "trusted") {
            return (
                <span className="inline-flex items-center gap-1">
          <Shield className="h-4 w-4" /> Trusted
        </span>
            );
        }
        return "Standard";
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestión de Usuarios y Confianza"
                description="Usuarios, reglas de confianza e incidentes (maqueta)."
            />

            <Tabs
                value={tab}
                onValueChange={setTab}
                options={[
                    { value: "users", label: "Usuarios" },
                    { value: "trust-rules", label: "Reglas de confianza" },
                    { value: "incidents", label: "Incidentes" },
                ]}
            />

            {tab === "users" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <span>Gestión de usuarios</span>
                            <div className="flex gap-2">
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por nombre o usuario..."
                                />
                                <Button onClick={() => setAddOpen(true)}>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Agregar
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <THead>
                                <TR>
                                    <TH>Usuario</TH>
                                    <TH>Username</TH>
                                    <TH>Email</TH>
                                    <TH>Rol</TH>
                                    <TH>Confianza</TH>
                                    <TH>Docs</TH>
                                    <TH>Cuenta</TH>
                                    <TH>Última actividad</TH>
                                    <TH>Acciones</TH>
                                </TR>
                            </THead>
                            <TBody>
                                {filtered.map((u) => (
                                    <TR key={u.id}>
                                        <TD className="font-medium text-gray-900">{u.fullName}</TD>
                                        <TD>@{u.username}</TD>
                                        <TD>{u.email}</TD>
                                        <TD>
                                            <Badge variant={roleVariant(u.role)}>{u.role}</Badge>
                                        </TD>
                                        <TD>
                                            <Badge variant={u.trustLevel === "vip" ? "warning" : u.trustLevel === "trusted" ? "info" : "outline"}>
                                                {trustBadge(u.trustLevel)}
                                            </Badge>
                                        </TD>
                                        <TD>
                                            <Badge variant={docVariant(u.docStatus)}>
                                                {u.docStatus === "none"
                                                    ? "Sin documentos"
                                                    : u.docStatus === "pending"
                                                        ? "Pendiente"
                                                        : u.docStatus === "approved"
                                                            ? "Aprobado"
                                                            : "Rechazado"}
                                            </Badge>
                                        </TD>
                                        <TD>
                                            <Badge variant={u.active ? "success" : "outline"}>
                                                {u.active ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </TD>
                                        <TD>{u.lastActivity}</TD>
                                        <TD>
                                            <div className="flex flex-wrap gap-2">
                                                <Button variant="secondary" className="px-3 py-1.5" onClick={() => setEditOpen(true)}>
                                                    Editar
                                                </Button>
                                                <Button variant="secondary" className="px-3 py-1.5" onClick={() => setDocOpen(true)}>
                                                    <BadgeCheck className="h-4 w-4 mr-2" />
                                                    Documentos
                                                </Button>
                                                <Button variant="secondary" className="px-3 py-1.5">
                                                    Cambiar rol
                                                </Button>
                                                <Button variant="secondary" className="px-3 py-1.5">
                                                    <ArrowUpCircle className="h-4 w-4 mr-2" />
                                                    Promover
                                                </Button>
                                                <Button variant="secondary" className="px-3 py-1.5">
                                                    <ArrowDownCircle className="h-4 w-4 mr-2" />
                                                    Degradar
                                                </Button>
                                            </div>
                                        </TD>
                                    </TR>
                                ))}
                            </TBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {tab === "trust-rules" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Promoción</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                                <div>
                                    <div className="font-medium text-gray-900">Promoción habilitada</div>
                                    <div className="text-sm text-gray-600">Automatiza ascensos</div>
                                </div>
                                <Switch checked />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="bft">Reservas (Trusted)</Label>
                                    <Input id="bft" type="number" defaultValue={5} />
                                </div>
                                <div>
                                    <Label htmlFor="att">Asistencia mínima %</Label>
                                    <Input id="att" type="number" defaultValue={80} />
                                </div>
                                <div>
                                    <Label htmlFor="pay">Pago a tiempo %</Label>
                                    <Input id="pay" type="number" defaultValue={90} />
                                </div>
                                <div>
                                    <Label htmlFor="bfv">Reservas (VIP)</Label>
                                    <Input id="bfv" type="number" defaultValue={20} />
                                </div>
                            </div>

                            <Button>Guardar reglas</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Degradación / Rehabilitación</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                                <div>
                                    <div className="font-medium text-gray-900">Degradación habilitada</div>
                                    <div className="text-sm text-gray-600">No-shows, pagos tardíos</div>
                                </div>
                                <Switch />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="noshow">No-shows (default 3)</Label>
                                    <Input id="noshow" type="number" defaultValue={3} />
                                </div>
                                <div>
                                    <Label htmlFor="late">Pagos tardíos (default 3)</Label>
                                    <Input id="late" type="number" defaultValue={3} />
                                </div>
                                <div>
                                    <Label htmlFor="cancel">Cancelaciones (default 5)</Label>
                                    <Input id="cancel" type="number" defaultValue={5} />
                                </div>
                                <div>
                                    <Label htmlFor="period">Periodo (días)</Label>
                                    <Input id="period" type="number" defaultValue={30} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                                <div>
                                    <div className="font-medium text-gray-900">Rehabilitación</div>
                                    <div className="text-sm text-gray-600">Reoportunidad a usuarios</div>
                                </div>
                                <Switch checked />
                            </div>

                            <Button variant="secondary">Guardar</Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {tab === "incidents" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Registrar incidente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="u">Usuario</Label>
                                <Select id="u" defaultValue="1">
                                    <option value="1">Dra. Sofía Hernández</option>
                                    <option value="2">Dr. Rodrigo Rodríguez</option>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="type">Tipo</Label>
                                <Select id="type" defaultValue="noshow">
                                    <option value="noshow">No-show</option>
                                    <option value="latepayment">Late payment</option>
                                    <option value="cancellation">Cancellation</option>
                                    <option value="goodbehavior">Good behavior</option>
                                    <option value="vip_override">VIP override</option>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="date">Fecha</Label>
                                <Input id="date" type="date" />
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                                <div>
                                    <div className="font-medium text-gray-900">Afecta nivel de confianza</div>
                                    <div className="text-sm text-gray-600">Switch (demo)</div>
                                </div>
                                <Switch checked />
                            </div>
                            <div>
                                <Label htmlFor="notes">Notas</Label>
                                <Textarea id="notes" rows={3} placeholder="Opcional" />
                            </div>
                            <Button>Registrar</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                Historial
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
                                Tabla de incidentes + acciones ver/editar/eliminar (maqueta)
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Modales */}
            <Dialog
                open={docOpen}
                onOpenChange={setDocOpen}
                title="Validación de documentos"
                description="UserDocumentationModal (maqueta)."
                maxWidthClassName="max-w-3xl"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setDocOpen(false)}>
                            Cerrar
                        </Button>
                        <Button variant="secondary">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Aprobar
                        </Button>
                        <Button variant="danger">
                            <X className="h-4 w-4 mr-2" />
                            Rechazar
                        </Button>
                    </div>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-md border border-gray-200 p-4">
                        <div className="font-medium text-gray-900">Identificación</div>
                        <div className="text-sm text-gray-600">Preview (demo)</div>
                    </div>
                    <div className="rounded-md border border-gray-200 p-4">
                        <div className="font-medium text-gray-900">Título profesional</div>
                        <div className="text-sm text-gray-600">Preview (demo)</div>
                    </div>
                    <div className="md:col-span-2 rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                        Estado: pendiente/aprobado/rechazado + notas del admin (demo)
                    </div>
                </div>
            </Dialog>

            <Dialog
                open={editOpen}
                onOpenChange={setEditOpen}
                title="Editar usuario"
                description="UserEditModal (maqueta)."
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setEditOpen(false)}>
                            Cancelar
                        </Button>
                        <Button>Guardar</Button>
                    </div>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="fn">Nombre completo</Label>
                        <Input id="fn" defaultValue="Dra. Sofía Hernández" />
                    </div>
                    <div>
                        <Label htmlFor="em">Email</Label>
                        <Input id="em" defaultValue="sofia@sati.mx" />
                    </div>
                    <div>
                        <Label htmlFor="rol">Rol</Label>
                        <Select id="rol" defaultValue="trusted">
                            <option value="standard">standard</option>
                            <option value="trusted">trusted</option>
                            <option value="vip">vip</option>
                            <option value="admin">admin</option>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="act">Cuenta activa</Label>
                        <div className="flex items-center gap-2">
                            <Switch checked />
                            <span className="text-sm text-gray-600">Activo</span>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog
                open={addOpen}
                onOpenChange={setAddOpen}
                title="Agregar usuario"
                description="UserAddModal (maqueta)."
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setAddOpen(false)}>
                            Cancelar
                        </Button>
                        <Button>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Crear
                        </Button>
                    </div>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="u1">Username</Label>
                        <Input id="u1" />
                    </div>
                    <div>
                        <Label htmlFor="p1">Password</Label>
                        <Input id="p1" type="password" />
                    </div>
                    <div>
                        <Label htmlFor="f1">Nombre completo</Label>
                        <Input id="f1" />
                    </div>
                    <div>
                        <Label htmlFor="e1">Email</Label>
                        <Input id="e1" />
                    </div>
                    <div>
                        <Label htmlFor="r1">Rol</Label>
                        <Select id="r1" defaultValue="standard">
                            <option value="standard">standard</option>
                            <option value="trusted">trusted</option>
                            <option value="vip">vip</option>
                            <option value="admin">admin</option>
                        </Select>
                    </div>
                    <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 md:col-span-2">
                        <div className="flex items-center gap-2 font-medium">
                            <AlertCircle className="h-4 w-4" />
                            Nota
                        </div>
                        <div className="mt-1">
                            Esta pantalla es solo UI. Formularios reales usan react-hook-form + zod.
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};