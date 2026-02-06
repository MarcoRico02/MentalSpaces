import React, { useMemo, useState } from "react";
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

type BookingRow = {
  id: string;
  room: string;
  user: string;
  date: string;
  time: string;
  status: "Confirmada" | "Completada" | "Cancelada";
};

export const AdminBookingsListPage: React.FC = () => {
  const [filterRoom, setFilterRoom] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const bookings: BookingRow[] = Array.from({ length: 10 }).map((_, i) => {
    const status = ["Confirmada", "Completada", "Cancelada"][i % 3] as BookingRow["status"];
    return {
      id: `BK-${1200 + i}`,
      room: `Consultorio ${1 + (i % 4)}`,
      user: ["Dra. Sofía", "Dr. Rodrigo", "Dra. Laura"][i % 3],
      date: "2026-02-05",
      time: "10:00 - 11:00",
      status,
    };
  });

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchRoom = filterRoom
        ? b.room.toLowerCase().includes(filterRoom.toLowerCase())
        : true;
      const matchUser = filterUser
        ? b.user.toLowerCase().includes(filterUser.toLowerCase())
        : true;
      const matchStatus = filterStatus === "all" ? true : b.status === filterStatus;
      return matchRoom && matchUser && matchStatus;
    });
  }, [filterRoom, filterUser, filterStatus]);

  const badgeVariant = (s: BookingRow["status"]) => {
    if (s === "Confirmada") return "info";
    if (s === "Completada") return "success";
    return "danger";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Reservas (Admin)"
        description="Vista administrativa simplificada con filtros y cambio de estado (maqueta)."
      />

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Sala</div>
              <Input
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
                placeholder="Nombre/ID"
              />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Usuario</div>
              <Input
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                placeholder="Nombre/ID"
              />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Estado</div>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Todos</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setFilterRoom("");
                  setFilterUser("");
                  setFilterStatus("all");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-gray-600">No hay reservas registradas</div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Sala</TH>
                  <TH>Usuario</TH>
                  <TH>Fecha</TH>
                  <TH>Horario</TH>
                  <TH>Estado</TH>
                  <TH>Acciones</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((b) => (
                  <TR key={b.id}>
                    <TD className="font-medium text-gray-900">{b.room}</TD>
                    <TD>{b.user}</TD>
                    <TD>{b.date}</TD>
                    <TD>{b.time}</TD>
                    <TD>
                      <Badge variant={badgeVariant(b.status)}>{b.status}</Badge>
                    </TD>
                    <TD>
                      <Select defaultValue={b.status}>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Completada">Completada</option>
                        <option value="Cancelada">Cancelada</option>
                      </Select>
                      <div className="text-xs text-gray-500 mt-1">
                        Actualización inmediata vía API (maqueta)
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
