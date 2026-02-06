import React, { useMemo, useState } from "react";
import { Copy, QrCode } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Table,
  TBody,
  TD,
  THead,
  TH,
  TR,
} from "../../components/ui";

type UserRow = {
  id: number;
  fullName: string;
  username: string;
  role: "STANDARD" | "TRUSTED" | "VIP" | "ADMIN";
};

type AccessHistoryRow = {
  id: number;
  therapist: string;
  code: string;
  generatedAt: string;
  expiresAt: string;
  status: "Activo" | "Expirado" | "Usado" | "Revocado";
};

export const AdminAccessPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [expiry, setExpiry] = useState("30");
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");

  // UI-only
  const [accessCode, setAccessCode] = useState<string>("482193");
  const now = "12:20";

  const users: UserRow[] = [
    { id: 1, fullName: "Dra. Sofía Hernández", username: "sofia", role: "STANDARD" },
    { id: 2, fullName: "Dr. Rodrigo Rodríguez", username: "drrodriguez", role: "TRUSTED" },
    { id: 3, fullName: "Admin SATI", username: "admin", role: "ADMIN" },
    { id: 4, fullName: "Dra. Laura López", username: "laura", role: "VIP" },
  ];

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users
      .filter((u) => u.role !== "ADMIN")
      .filter((u) => {
        if (!term) return true;
        return (
          u.fullName.toLowerCase().includes(term) ||
          u.username.toLowerCase().includes(term)
        );
      });
  }, [search]);

  const history: AccessHistoryRow[] = [
    {
      id: 1,
      therapist: "Dra. Sofía Hernández",
      code: "482193",
      generatedAt: "2026-02-05 12:10",
      expiresAt: "12:40",
      status: "Activo",
    },
    {
      id: 2,
      therapist: "Dr. Rodrigo Rodríguez",
      code: "921044",
      generatedAt: "2026-02-04 10:00",
      expiresAt: "10:30",
      status: "Expirado",
    },
    {
      id: 3,
      therapist: "Dra. Laura López",
      code: "553210",
      generatedAt: "2026-02-03 18:00",
      expiresAt: "20:00",
      status: "Usado",
    },
  ];

  const statusVariant = (s: AccessHistoryRow["status"]) => {
    if (s === "Activo") return "success";
    if (s === "Expirado") return "outline";
    if (s === "Usado") return "info";
    return "danger";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Control de Acceso"
        description="Genera códigos temporales para chapas electrónicas (maqueta)."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generación */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Generar código</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Buscar terapeuta</div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre o usuario..."
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Seleccionar</div>
              <div className="max-h-44 overflow-y-auto space-y-2 rounded-md border border-gray-200 p-2">
                {filteredUsers.map((u) => {
                  const active = selectedUserId === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelectedUserId(u.id)}
                      className={`w-full text-left rounded-md px-3 py-2 border transition-colors ${
                        active
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium text-gray-900">{u.fullName}</div>
                      <div className="text-sm text-gray-600">@{u.username}</div>
                    </button>
                  );
                })}
              </div>
              <div className="text-xs text-gray-500 mt-1">Excluye administradores (demo)</div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Expiración</div>
              <Select value={expiry} onChange={(e) => setExpiry(e.target.value)}>
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">60 minutos</option>
                <option value="120">120 minutos</option>
              </Select>
              <div className="text-xs text-gray-500 mt-1">
                Hora actual: {now} · Expira en: {expiry} min (demo)
              </div>
            </div>

            <div className="rounded-md border border-gray-200 p-4">
              <div className="text-sm text-gray-600">Código generado</div>
              <div className="text-3xl font-bold tracking-widest text-gray-900 mt-2">
                {accessCode}
              </div>
              <div className="text-xs text-gray-500 mt-2">Tiempo restante: 00:29 (demo)</div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                <Button variant="secondary">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generar QR
                </Button>
                <Button onClick={() => setAccessCode(String(Math.floor(100000 + Math.random() * 900000)))}>
                  Generar
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Simulación: setTimeout 1500ms + toast (mencionado) — no implementado.
            </div>
          </CardContent>
        </Card>

        {/* Historial */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historial de accesos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Terapeuta</TH>
                  <TH>Código</TH>
                  <TH>Generado</TH>
                  <TH>Expira</TH>
                  <TH>Estado</TH>
                  <TH>Acciones</TH>
                </TR>
              </THead>
              <TBody>
                {history.map((h) => (
                  <TR key={h.id}>
                    <TD className="font-medium text-gray-900">{h.therapist}</TD>
                    <TD className="font-mono">{h.code}</TD>
                    <TD>{h.generatedAt}</TD>
                    <TD>{h.expiresAt}</TD>
                    <TD>
                      <Badge variant={statusVariant(h.status)}>{h.status}</Badge>
                    </TD>
                    <TD>
                      <Button variant="danger" className="px-3 py-1.5">
                        Revocar
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
