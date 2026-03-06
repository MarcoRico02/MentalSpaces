import React, { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AlertTriangle,
    ArrowDownCircle,
    Award,
    BadgeCheck,
    CheckCircle2,
    History,
    Shield,
    UserX,
    Users,
} from "lucide-react";

import { PageHeader } from "../../components/common/PageHeader";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { showToast } from "../../../core/infraestructura/utilidades/toast";
import { apiClient } from "../../../core/infraestructura/api/api";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Dialog,
    Input,
    Label,
    Select,
    Separator,
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

type UserTrustLevel = "novato" | "confiable" | "vip" | "problemático";

type UserRow = {
    id: number;
    username: string;
    fullName: string;
};

type UserTrustLevelRow = {
    id: number;
    username: string;
    fullName: string;
    trustLevel: UserTrustLevel;
    lastChange: string;
    bookings: number;
    attendanceRate: number;
    paymentOnTimeRate: number;
};

type IncidentType =
    | "noshow"
    | "latepayment"
    | "cancellation"
    | "goodbehavior"
    | "vip_override";

type IncidentRow = {
    id: number;
    userId: number;
    username: string;
    date: string;
    incidentType: IncidentType;
    notes?: string;
    affectedTrustLevel: boolean;
};

const trustRulesSchema = z.object({
    // Promoción
    promotionEnabled: z.boolean().default(true),

    bookingsForTrusted: z.coerce.number().min(1).default(5),
    minimumAttendanceRateForTrusted: z.coerce.number().min(0).max(100).default(80),
    paymentOnTimeRateForTrusted: z.coerce.number().min(0).max(100).default(90),

    bookingsForVip: z.coerce.number().min(1).default(20),
    minimumAttendanceRateForVip: z.coerce.number().min(0).max(100).default(90),
    paymentOnTimeRateForVip: z.coerce.number().min(0).max(100).default(95),
    consecutiveBookingsForVip: z.coerce.number().min(1).default(3),
    minimumTimeAsTrustedDays: z.coerce.number().min(1).default(30),

    // Degradación
    degradationEnabled: z.boolean().default(true),
    noShowsForDegradation: z.coerce.number().min(1).default(3),
    latePaymentsForDegradation: z.coerce.number().min(1).default(3),
    cancellationsForDegradation: z.coerce.number().min(1).default(5),
    degradationPeriodDays: z.coerce.number().min(1).default(30),

    // General
    historyPeriodMonths: z.coerce.number().min(1).default(3),
    penaltiesEnabled: z.boolean().default(true),
    bonusesEnabled: z.boolean().default(true),

    // Rehabilitación
    rehabilitationEnabled: z.boolean().default(true),
    rehabilitationPeriodDays: z.coerce.number().min(1).default(60),
    rehabilitationRequirements: z
        .string()
        .default("5 reservas exitosas consecutivas con pago a tiempo"),
});

type TrustRulesValues = z.infer<typeof trustRulesSchema>;

const incidentSchema = z.object({
    userId: z.coerce.number().min(1),
    incidentType: z.enum([
        "noshow",
        "latepayment",
        "cancellation",
        "goodbehavior",
        "vip_override",
    ]),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    notes: z.string().optional(),
    affectsTrustLevel: z.boolean().default(true),
});


const trustLevelBadgeVariant = (level: UserTrustLevel) => {
    if (level === "vip") return "warning";
    if (level === "confiable") return "info";
    if (level === "problemático") return "danger";
    return "outline";
};

const trustLevelLabel = (level: UserTrustLevel) => {
    if (level === "vip") return "VIP";
    if (level === "confiable") return "Confiable";
    if (level === "problemático") return "Problemático";
    return "Novato";
};

const incidentBadge = (t: IncidentType) => {
    const base = "inline-flex items-center gap-1";
    if (t === "noshow") {
        return (
            <Badge variant="danger" className={base}>
                <AlertTriangle className="h-3.5 w-3.5" /> No se presentó
            </Badge>
        );
    }
    if (t === "latepayment") return <Badge variant="danger">Pago tardío</Badge>;
    if (t === "cancellation") return <Badge variant="danger">Cancelación tardía</Badge>;
    if (t === "goodbehavior") return <Badge variant="success">Buen comportamiento</Badge>;
    return <Badge variant="warning">Promoción manual</Badge>;
};

export const TrustLevelPage: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const roles = user?.usuarioInfoDTO?.roles ?? [];
    const canAccess = roles.includes("ADMIN") || roles.includes("PROPIETARIO");

    const [activeTab, setActiveTab] = useState("promotion");
    const [showIncidentDialog, setShowIncidentDialog] = useState(false);

    const form = useForm({
        // Nota: en este repo estamos usando zod v4; para evitar fricción de tipos entre
        // zodResolver y defaultValues, dejamos el form sin genérico.
        resolver: zodResolver(trustRulesSchema),
        defaultValues: trustRulesSchema.parse({}),
        mode: "onChange",
    });

    const incidentForm = useForm({
        resolver: zodResolver(incidentSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            incidentType: "noshow",
            affectsTrustLevel: true,
        },
        mode: "onChange",
    });

    // Nota: en este repo el endpoint de usuarios existente es /usuarios (por authAPI.me etc.);
    // aquí intentamos /usuarios para no inventar /users.
    const { data: usersData } = useQuery<UserRow[]>({
        queryKey: ["/api/usuarios"],
        enabled: canAccess,
        queryFn: async () => {
            const res = await apiClient.get<any>("/usuarios");
            const payload = res.data;

            // Aceptamos distintos formatos sin romper la UI:
            // - Array directo: [ {id, username, fullName}, ... ]
            // - DTO envuelto: { content: [...] } (paginado)
            // - DTO envuelto: { data: [...] }
            const maybeArray =
                Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.content)
                        ? payload.content
                        : Array.isArray(payload?.data)
                            ? payload.data
                            : [];

            return maybeArray
                .filter((u: any) => u && (typeof u.id === "number" || typeof u.id === "string"))
                .map((u: any) => ({
                    id: typeof u.id === "string" ? Number(u.id) : u.id,
                    username: String(u.username ?? u.email ?? u.nombreUsuario ?? ""),
                    fullName: String(u.fullName ?? u.nombreCompleto ?? u.name ?? ""),
                }))
                .filter((u: UserRow) => Number.isFinite(u.id) && !!u.username);
        },
        select: (data) => (Array.isArray(data) ? data : []),
        placeholderData: [],
        retry: (failureCount, err: any) => {
            const status = err?.response?.status;
            if (status === 403) return false;
            return failureCount < 1;
        },
    });

    const users = Array.isArray(usersData) ? usersData : [];

    // Mock local (hasta implementar backend): niveles actuales
    const userTrustLevels: UserTrustLevelRow[] = useMemo(
        () => [
            {
                id: 2,
                username: "maria.garcia",
                fullName: "María García",
                trustLevel: "vip",
                lastChange: "2025-02-15",
                bookings: 32,
                attendanceRate: 97,
                paymentOnTimeRate: 100,
            },
            {
                id: 3,
                username: "carlos.lopez",
                fullName: "Carlos López",
                trustLevel: "problemático",
                lastChange: "2025-03-01",
                bookings: 15,
                attendanceRate: 60,
                paymentOnTimeRate: 80,
            },
            {
                id: 4,
                username: "ana.martinez",
                fullName: "Ana Martínez",
                trustLevel: "confiable",
                lastChange: "2025-02-10",
                bookings: 12,
                attendanceRate: 92,
                paymentOnTimeRate: 100,
            },
            {
                id: 5,
                username: "juan.rodriguez",
                fullName: "Juan Rodríguez",
                trustLevel: "novato",
                lastChange: "2025-02-25",
                bookings: 2,
                attendanceRate: 100,
                paymentOnTimeRate: 100,
            },
        ],
        [],
    );

    const recentIncidents: IncidentRow[] = useMemo(
        () => [
            {
                id: 1,
                userId: 3,
                username: "carlos.lopez",
                date: "2025-03-01",
                incidentType: "noshow",
                notes: "No se presentó sin aviso previo",
                affectedTrustLevel: true,
            },
            {
                id: 2,
                userId: 3,
                username: "carlos.lopez",
                date: "2025-02-20",
                incidentType: "latepayment",
                notes: "Pago con retraso de 5 días",
                affectedTrustLevel: true,
            },
            {
                id: 3,
                userId: 2,
                username: "maria.garcia",
                date: "2025-02-15",
                incidentType: "vip_override",
                notes: "Promoción manual a VIP (admin)",
                affectedTrustLevel: true,
            },
            {
                id: 4,
                userId: 4,
                username: "ana.martinez",
                date: "2025-02-10",
                incidentType: "goodbehavior",
                notes: "Buen comportamiento constante",
                affectedTrustLevel: true,
            },
            {
                id: 5,
                userId: 3,
                username: "carlos.lopez",
                date: "2025-02-05",
                incidentType: "cancellation",
                notes: "Cancelación con menos de 24h",
                affectedTrustLevel: true,
            },
        ],
        [],
    );

    const updateRulesMutation = useMutation({
        mutationFn: async (data: TrustRulesValues) => {
            // Pendiente: backend real. Por ahora simulación.
            // Cuando exista: apiClient.put("/admin/trust-rules", data)
            // eslint-disable-next-line no-console
            console.log("Enviando reglas de confianza:", data);
            return { success: true };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-rules"] });
            showToast.success(
                "Reglas de nivel de confianza actualizadas correctamente.",
            );
        },
        onError: (e: any) => {
            const status = e?.response?.status;
            if (status === 403) {
                showToast.error("Acceso restringido: se requiere rol ADMIN.");
                return;
            }
            showToast.error(
                `Error al guardar reglas: ${e instanceof Error ? e.message : "Error desconocido"}`,
            );
        },
    });

    const handleSaveIncident = (values: any) => {
        const parsed = incidentSchema.parse(values);
        const selectedUser = users.find((u) => u.id === parsed.userId);

        // eslint-disable-next-line no-console
        console.log("Registrando incidente:", {
            ...parsed,
            username: selectedUser?.username,
        });

        showToast.success(
            `Incidente registrado para ${selectedUser?.username || "el usuario"}.`,
        );

        setShowIncidentDialog(false);
        incidentForm.reset({
            date: new Date().toISOString().split("T")[0],
            incidentType: "noshow",
            affectsTrustLevel: true,
            notes: "",
        });
    };

    if (!canAccess) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Sistema de Nivel de Confianza"
                    description="Acceso restringido: solo administradores y propietarios."
                />
                <Card>
                    <CardContent>
                        <div className="py-10 text-center">
                            <div className="text-lg font-semibold text-default">
                                Acceso restringido
                            </div>
                            <div className="text-sm text-secondary mt-2">
                                Tu cuenta no tiene permisos para ver esta página.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const renderPromotion = () => (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Promoción automática</span>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={!!form.watch("promotionEnabled")}
                                onCheckedChange={(checked) =>
                                    form.setValue("promotionEnabled", checked)
                                }
                            />
                            <span className="text-sm text-secondary">Habilitar</span>
                        </div>
                    </CardTitle>
                    <CardDescription>
                        Define los requisitos para promover usuarios a Confiable y VIP.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <Label htmlFor="bookingsForTrusted">
                            Reservas completadas requeridas
                        </Label>
                        <Input
                            id="bookingsForTrusted"
                            type="number"
                            {...form.register("bookingsForTrusted")}
                            min={1}
                        />
                    </div>
                    <div>
                        <Label htmlFor="minimumAttendanceRateForTrusted">
                            Asistencia mínima (%)
                        </Label>
                        <Input
                            id="minimumAttendanceRateForTrusted"
                            type="number"
                            {...form.register("minimumAttendanceRateForTrusted")}
                            min={0}
                            max={100}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paymentOnTimeRateForTrusted">Pagos puntuales (%)</Label>
                        <Input
                            id="paymentOnTimeRateForTrusted"
                            type="number"
                            {...form.register("paymentOnTimeRateForTrusted")}
                            min={0}
                            max={100}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BadgeCheck className="h-5 w-5 text-blue-600" /> Confiable
                        </CardTitle>
                        <CardDescription>Novato → Confiable</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label htmlFor="bookingsForTrusted">
                                Reservas completadas requeridas
                            </Label>
                            <Input
                                id="bookingsForTrusted"
                                type="number"
                                {...form.register("bookingsForTrusted")}
                                min={1}
                            />
                        </div>
                        <div>
                            <Label htmlFor="minimumAttendanceRateForTrusted">
                                Asistencia mínima (%)
                            </Label>
                            <Input
                                id="minimumAttendanceRateForTrusted"
                                type="number"
                                {...form.register("minimumAttendanceRateForTrusted")}
                                min={0}
                                max={100}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paymentOnTimeRateForTrusted">Pagos puntuales (%)</Label>
                            <Input
                                id="paymentOnTimeRateForTrusted"
                                type="number"
                                {...form.register("paymentOnTimeRateForTrusted")}
                                min={0}
                                max={100}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-purple-600" /> VIP
                        </CardTitle>
                        <CardDescription>Confiable → VIP</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label htmlFor="bookingsForVip">Reservas totales requeridas</Label>
                            <Input
                                id="bookingsForVip"
                                type="number"
                                {...form.register("bookingsForVip")}
                                min={1}
                            />
                        </div>
                        <div>
                            <Label htmlFor="minimumAttendanceRateForVip">Asistencia mínima (%)</Label>
                            <Input
                                id="minimumAttendanceRateForVip"
                                type="number"
                                {...form.register("minimumAttendanceRateForVip")}
                                min={0}
                                max={100}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paymentOnTimeRateForVip">Pagos puntuales (%)</Label>
                            <Input
                                id="paymentOnTimeRateForVip"
                                type="number"
                                {...form.register("paymentOnTimeRateForVip")}
                                min={0}
                                max={100}
                            />
                        </div>
                        <div>
                            <Label htmlFor="consecutiveBookingsForVip">
                                Reservas consecutivas sin problemas
                            </Label>
                            <Input
                                id="consecutiveBookingsForVip"
                                type="number"
                                {...form.register("consecutiveBookingsForVip")}
                                min={1}
                            />
                        </div>
                        <div>
                            <Label htmlFor="minimumTimeAsTrustedDays">Días mínimos como Confiable</Label>
                            <Input
                                id="minimumTimeAsTrustedDays"
                                type="number"
                                {...form.register("minimumTimeAsTrustedDays")}
                                min={1}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {Object.keys(form.formState.errors).length > 0 && (
                <div className="text-sm text-red-600">
                    Hay errores de validación. Revisa los campos.
                </div>
            )}
        </div>
    );

    const renderDegradation = () => (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Degradación automática</span>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={!!form.watch("degradationEnabled")}
                                onCheckedChange={(checked) =>
                                    form.setValue("degradationEnabled", checked)
                                }
                            />
                            <span className="text-sm text-secondary">Habilitar</span>
                        </div>
                    </CardTitle>
                    <CardDescription>
                        Condiciones para degradar a usuarios a nivel Problemático.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                    <div>
                        <Label htmlFor="noShowsForDegradation">Inasistencias (no-show)</Label>
                        <Input
                            id="noShowsForDegradation"
                            type="number"
                            {...form.register("noShowsForDegradation")}
                            min={1}
                        />
                    </div>
                    <div>
                        <Label htmlFor="latePaymentsForDegradation">Pagos tardíos</Label>
                        <Input
                            id="latePaymentsForDegradation"
                            type="number"
                            {...form.register("latePaymentsForDegradation")}
                            min={1}
                        />
                    </div>
                    <div>
                        <Label htmlFor="cancellationsForDegradation">Cancelaciones tardías</Label>
                        <Input
                            id="cancellationsForDegradation"
                            type="number"
                            {...form.register("cancellationsForDegradation")}
                            min={1}
                        />
                    </div>
                    <div>
                        <Label htmlFor="degradationPeriodDays">Período de evaluación (días)</Label>
                        <Input
                            id="degradationPeriodDays"
                            type="number"
                            {...form.register("degradationPeriodDays")}
                            min={1}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Rehabilitación</span>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={!!form.watch("rehabilitationEnabled")}
                                onCheckedChange={(checked) =>
                                    form.setValue("rehabilitationEnabled", checked)
                                }
                            />
                            <span className="text-sm text-secondary">Habilitar</span>
                        </div>
                    </CardTitle>
                    <CardDescription>
                        Permite que usuarios problemáticos se recuperen tras un período.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <Label htmlFor="rehabilitationPeriodDays">
                            Período mínimo como problemático (días)
                        </Label>
                        <Input
                            id="rehabilitationPeriodDays"
                            type="number"
                            {...form.register("rehabilitationPeriodDays")}
                            min={1}
                        />
                    </div>
                    <div>
                        <Label htmlFor="rehabilitationRequirements">Requisitos de rehabilitación</Label>
                        <Textarea
                            id="rehabilitationRequirements"
                            {...form.register("rehabilitationRequirements")}
                            rows={4}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderGeneral = () => (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Parámetros generales</CardTitle>
                    <CardDescription>
                        Controla el período de historial y si se aplican penalizaciones/bonos.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                    <div>
                        <Label htmlFor="historyPeriodMonths">Historial considerado (meses)</Label>
                        <Input
                            id="historyPeriodMonths"
                            type="number"
                            {...form.register("historyPeriodMonths")}
                            min={1}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <Label htmlFor="penaltiesEnabled">Penalizaciones</Label>
                            <div className="text-xs text-secondary">
                                Restringir/penalizar por comportamiento negativo.
                            </div>
                        </div>
                        <Switch
                            checked={!!form.watch("penaltiesEnabled")}
                            onCheckedChange={(checked) => form.setValue("penaltiesEnabled", checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <Label htmlFor="bonusesEnabled">Bonificaciones</Label>
                            <div className="text-xs text-secondary">
                                Beneficios por comportamiento positivo.
                            </div>
                        </div>
                        <Switch
                            checked={!!form.watch("bonusesEnabled")}
                            onCheckedChange={(checked) => form.setValue("bonusesEnabled", checked)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Sistema de Nivel de Confianza"
                description="Reglas, degradación, rehabilitación e incidentes (maqueta lista para conectar a backend)."
                right={
                    <Button variant="secondary" onClick={() => setShowIncidentDialog(true)}>
                        <History className="h-4 w-4 mr-2" /> Registrar Incidente
                    </Button>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>Niveles de confianza</CardTitle>
                    <CardDescription>
                        Progresión normal: Novato → Confiable → VIP. Degradación a Problemático.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid gap-3">
                        <div className="flex items-start gap-4 p-4 border rounded-lg bg-app border-dashed">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-1">Novato</h3>
                                <p className="text-sm text-secondary">Usuario nuevo con historial limitado</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-secondary">
                                    <li>Sin privilegios especiales</li>
                                    <li>Máximo 7 días de antelación</li>
                                </ul>
                            </div>
                            <ArrowDownCircle className="h-5 w-5 text-blue-400" />
                        </div>

                        <div className="flex items-start gap-4 p-4 border rounded-lg bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 ml-6">
                            <BadgeCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-1 text-blue-700 dark:text-blue-400">Confiable</h3>
                                <p className="text-sm text-blue-700 dark:text-blue-400">Usuario con buen historial</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-300">
                                    <li>Hasta 14 días de antelación</li>
                                    <li>Reservas consecutivas permitidas</li>
                                </ul>
                            </div>
                            <ArrowDownCircle className="h-5 w-5 text-purple-400" />
                        </div>

                        <div className="flex items-start gap-4 p-4 border rounded-lg bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 ml-12">
                            <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-1 text-purple-700 dark:text-purple-400">VIP</h3>
                                <p className="text-sm text-purple-700 dark:text-purple-400">Privilegios especiales</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-purple-800 dark:text-purple-300">
                                    <li>Hasta 30 días de antelación</li>
                                    <li>Acceso a horas premium</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 border rounded-lg bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 ml-6 mt-4">
                            <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-1 text-red-700 dark:text-red-400">Problemático</h3>
                                <p className="text-sm text-red-700 dark:text-red-400">Historial de incidentes negativos</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-red-800 dark:text-red-300">
                                    <li>Restricciones de reservas</li>
                                    <li>Pago por adelantado</li>
                                    <li>Máximo 3 días de antelación</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Configuración</span>
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-secondary" />
                            <span className="text-sm text-secondary">Admin</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        options={[
                            { value: "promotion", label: "Promoción" },
                            { value: "degradation", label: "Degradación" },
                            { value: "general", label: "General" },
                        ]}
                    />

                    {activeTab === "promotion" && renderPromotion()}
                    {activeTab === "degradation" && renderDegradation()}
                    {activeTab === "general" && renderGeneral()}

                    <Separator />

                    <div className="flex justify-end">
                        <Button
                            onClick={form.handleSubmit((values) => updateRulesMutation.mutate(values))}
                            disabled={updateRulesMutation.isPending}
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {updateRulesMutation.isPending ? "Guardando..." : "Guardar Configuración"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-3">
                <h2 className="text-xl font-bold text-default">Niveles actuales</h2>
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <THead>
                                <TR>
                                    <TH>Usuario</TH>
                                    <TH>Nivel</TH>
                                    <TH>Último cambio</TH>
                                    <TH>Reservas</TH>
                                    <TH>Asistencia</TH>
                                    <TH>Pagos a tiempo</TH>
                                </TR>
                            </THead>
                            <TBody>
                                {userTrustLevels.map((u) => (
                                    <TR key={u.id}>
                                        <TD>
                                            <div className="font-medium text-default">{u.username}</div>
                                            <div className="text-xs text-secondary">{u.fullName}</div>
                                        </TD>
                                        <TD>
                                            <Badge variant={trustLevelBadgeVariant(u.trustLevel)}>
                                                {trustLevelLabel(u.trustLevel)}
                                            </Badge>
                                        </TD>
                                        <TD>{u.lastChange}</TD>
                                        <TD>{u.bookings}</TD>
                                        <TD>{u.attendanceRate}%</TD>
                                        <TD>{u.paymentOnTimeRate}%</TD>
                                    </TR>
                                ))}
                            </TBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <div className="text-xs text-secondary">
                            Nota: estos datos están simulados hasta conectar endpoints del backend.
                        </div>
                    </CardFooter>
                </Card>
            </div>

            <div className="space-y-3">
                <h2 className="text-xl font-bold text-default">Incidentes recientes</h2>
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <THead>
                                <TR>
                                    <TH>Fecha</TH>
                                    <TH>Usuario</TH>
                                    <TH>Tipo</TH>
                                    <TH>Notas</TH>
                                    <TH>Afectó nivel</TH>
                                </TR>
                            </THead>
                            <TBody>
                                {recentIncidents.map((i) => (
                                    <TR key={i.id}>
                                        <TD>{i.date}</TD>
                                        <TD>{i.username}</TD>
                                        <TD>{incidentBadge(i.incidentType)}</TD>
                                        <TD className="max-w-130">{i.notes || "—"}</TD>
                                        <TD>
                                            <Badge variant={i.affectedTrustLevel ? "success" : "outline"}>
                                                {i.affectedTrustLevel ? "Sí" : "No"}
                                            </Badge>
                                        </TD>
                                    </TR>
                                ))}
                            </TBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <div className="text-xs text-secondary">
                            Siguiente paso: persistir incidentes en backend y refrescar con React Query.
                        </div>
                    </CardFooter>
                </Card>
            </div>

            <Dialog
                open={showIncidentDialog}
                onOpenChange={setShowIncidentDialog}
                title="Registrar Incidente"
                description="Registra un incidente que afecte (o no) el nivel de confianza del usuario."
                maxWidthClassName="max-w-xl"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowIncidentDialog(false)}
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={incidentForm.handleSubmit(handleSaveIncident)}
                            type="button"
                        >
                            Guardar incidente
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="incident_user">Usuario</Label>
                        <Select
                            id="incident_user"
                            value={incidentForm.watch("userId") ? String(incidentForm.watch("userId")) : ""}
                            onChange={(e) => incidentForm.setValue("userId", Number(e.target.value))}
                        >
                            <option value="" disabled>
                                Selecciona un usuario...
                            </option>
                            {users
                                .filter((u) => typeof u.id === "number")
                                .map((u) => (
                                    <option key={u.id} value={String(u.id)}>
                                        {u.username} ({u.fullName})
                                    </option>
                                ))}
                        </Select>
                        {incidentForm.formState.errors.userId && (
                            <p className="text-sm text-red-600 mt-1">
                                Selecciona un usuario válido.
                            </p>
                        )}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div>
                            <Label htmlFor="incident_type">Tipo de incidente</Label>
                            <Select
                                id="incident_type"
                                value={incidentForm.watch("incidentType")}
                                onChange={(e) =>
                                    incidentForm.setValue("incidentType", e.target.value as IncidentType)
                                }
                            >
                                <option value="noshow">No se presentó</option>
                                <option value="latepayment">Pago tardío</option>
                                <option value="cancellation">Cancelación tardía</option>
                                <option value="goodbehavior">Buen comportamiento</option>
                                <option value="vip_override">Promoción manual</option>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="incident_date">Fecha</Label>
                            <Input
                                id="incident_date"
                                type="date"
                                value={incidentForm.watch("date")}
                                onChange={(e) => incidentForm.setValue("date", e.target.value)}
                            />
                            {incidentForm.formState.errors.date && (
                                <p className="text-sm text-red-600 mt-1">Fecha inválida (YYYY-MM-DD).</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="incident_notes">Notas (opcional)</Label>
                        <Textarea
                            id="incident_notes"
                            value={incidentForm.watch("notes") || ""}
                            onChange={(e) => incidentForm.setValue("notes", e.target.value)}
                            placeholder="Detalles adicionales sobre el incidente..."
                            rows={4}
                        />
                    </div>

                    <div className="flex items-center justify-between gap-4 p-3 border rounded-lg bg-app">
                        <div>
                            <div className="font-medium text-default">Afecta nivel de confianza</div>
                            <div className="text-xs text-secondary">
                                Si está activo, este incidente contará para las métricas.
                            </div>
                        </div>
                        <Switch
                            checked={!!incidentForm.watch("affectsTrustLevel")}
                            onCheckedChange={(checked) =>
                                incidentForm.setValue("affectsTrustLevel", checked)
                            }
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

