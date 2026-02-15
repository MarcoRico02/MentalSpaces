import React, { useState } from "react";
import { PageHeader } from "../../components/common/PageHeader";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Dialog,
    Input,
    Select,
    Table,
    TBody,
    TD,
    THead,
    TH,
    TR,
} from "../../components/ui";

type Severity = "ALL" | "INFO" | "WARN" | "ERROR" | "CRITICAL";

type LogRow = {
    id: number;
    createdAt: string;
    severity: Severity;
    endpoint: string;
    userId: string;
    message: string;
    stack?: string;
    userAgent?: string;
    url?: string;
};

const severityColors: Record<string, string> = {
    INFO: "bg-blue-100 text-blue-800",
    WARN: "bg-yellow-100 text-yellow-800",
    ERROR: "bg-red-100 text-red-800",
    CRITICAL: "bg-fuchsia-100 text-fuchsia-800",
};

export const LogsPage: React.FC = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [severity, setSeverity] = useState<Severity>("ALL");
    const [moduleLike, setModuleLike] = useState("");
    const [userId, setUserId] = useState("");
    const [sort, setSort] = useState<"createdAt" | "severity">("createdAt");
    const [dir, setDir] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [detailOpen, setDetailOpen] = useState(false);

    const rows: LogRow[] = Array.from({ length: 12 }).map((_, i) => {
        const sev = (["INFO", "WARN", "ERROR", "CRITICAL"][i % 4] as Severity) ?? "INFO";
        return {
            id: 9000 + i,
            createdAt: "2026-02-05 12:10",
            severity: sev,
            endpoint: "/api/bookings",
            userId: String(100 + i),
            message: "Mensaje de log (truncado en tabla).",
            stack: sev === "ERROR" || sev === "CRITICAL" ? "Stack trace demo...\nline 1\nline 2" : undefined,
            userAgent: "Mozilla/5.0 (demo)",
            url: "https://sati.mx/demo",
        };
    });

    const badgeClass = (sev: Severity) => {
        if (sev === "ALL") return "bg-gray-100 text-gray-800";
        return severityColors[sev] ?? "bg-gray-100 text-gray-800";
    };

    const toggleSort = (field: "createdAt" | "severity") => {
        if (sort === field) {
            setDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSort(field);
            setDir("asc");
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Logs de Auditoría"
                description="Búsqueda, filtros, paginación y detalle (maqueta)."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Filtros avanzados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        <div>
                            <div className="text-sm font-medium text-gray-700 mb-1">Desde</div>
                            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700 mb-1">Hasta</div>
                            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700 mb-1">Severidad</div>
                            <Select value={severity} onChange={(e) => setSeverity(e.target.value as Severity)}>
                                <option value="ALL">ALL</option>
                                <option value="INFO">INFO</option>
                                <option value="WARN">WARN</option>
                                <option value="ERROR">ERROR</option>
                                <option value="CRITICAL">CRITICAL</option>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <div className="text-sm font-medium text-gray-700 mb-1">Módulo/Endpoint</div>
                            <Input
                                value={moduleLike}
                                onChange={(e) => setModuleLike(e.target.value)}
                                placeholder="/api/..."
                            />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700 mb-1">Usuario ID</div>
                            <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="123" />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-gray-600">
                            Auto-refresh: 15s (mencionado) · pageSize: 20 (demo)
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setPage(1)}>
                                Buscar
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setFromDate("");
                                    setToDate("");
                                    setSeverity("ALL");
                                    setModuleLike("");
                                    setUserId("");
                                    setPage(1);
                                }}
                            >
                                Limpiar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tabla de logs</CardTitle>
                    <div className="text-xs text-gray-500 mt-1">
                        Ordenamiento interactivo: {sort} ({dir})
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <THead>
                            <TR>
                                <TH>
                                    <button type="button" className="hover:underline" onClick={() => toggleSort("createdAt")}>
                                        Fecha/Hora {sort === "createdAt" ? (dir === "asc" ? "▲" : "▼") : ""}
                                    </button>
                                </TH>
                                <TH>
                                    <button type="button" className="hover:underline" onClick={() => toggleSort("severity")}>
                                        Severidad {sort === "severity" ? (dir === "asc" ? "▲" : "▼") : ""}
                                    </button>
                                </TH>
                                <TH>Módulo/Endpoint</TH>
                                <TH>Usuario ID</TH>
                                <TH>Mensaje</TH>
                                <TH>Acciones</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {rows.map((r) => (
                                <TR key={r.id}>
                                    <TD>{r.createdAt}</TD>
                                    <TD>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass(r.severity)}`}>
                      {r.severity}
                    </span>
                                    </TD>
                                    <TD className="font-mono text-xs">{r.endpoint}</TD>
                                    <TD>{r.userId}</TD>
                                    <TD className="max-w-[420px] truncate">{r.message}</TD>
                                    <TD>
                                        <Button variant="secondary" className="px-3 py-1.5" onClick={() => setDetailOpen(true)}>
                                            Ver detalle
                                        </Button>
                                    </TD>
                                </TR>
                            ))}
                        </TBody>
                    </Table>

                    <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="text-gray-600">Página {page} de 10 · Total: 200 (demo)</div>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setPage(1)}>Primera</Button>
                            <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</Button>
                            <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
                            <Button variant="secondary" onClick={() => setPage(10)}>Última</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog
                open={detailOpen}
                onOpenChange={setDetailOpen}
                title="Detalle de log"
                description="Modal con información completa (maqueta)."
                maxWidthClassName="max-w-3xl"
                footer={
                    <div className="flex justify-end">
                        <Button variant="secondary" onClick={() => setDetailOpen(false)}>
                            Cerrar
                        </Button>
                    </div>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {[
                        ["ID", "9001"],
                        ["Fecha", "2026-02-05 12:10"],
                        ["Severidad", "ERROR"],
                        ["Usuario", "101"],
                        ["Endpoint", "/api/bookings"],
                        ["URL", "https://sati.mx/demo"],
                    ].map(([k, v]) => (
                        <div key={k} className="rounded-md border border-gray-200 p-3">
                            <div className="text-gray-600">{k}</div>
                            <div className="font-medium text-gray-900">{v}</div>
                        </div>
                    ))}
                    <div className="md:col-span-2">
                        <div className="text-sm font-medium text-gray-700 mb-2">Stack trace</div>
                        <pre className="max-h-48 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-3 text-xs">
Stack trace demo...
line 1
line 2
line 3
            </pre>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};