import React, { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
} from "../../components/ui";

type BookingBlock = {
  id: string;
  room: string;
  start: string;
  end: string;
  therapist: string;
  status: "Confirmada" | "Pendiente" | "Completada" | "Cancelada";
};

const HOURS = Array.from({ length: 13 }).map((_, i) => 8 + i); // 8..20

export const BookingsPage: React.FC = () => {
  const [date, setDate] = useState("2026-02-05");
  const [location, setLocation] = useState("all");

  const rooms = ["Consultorio 1", "Consultorio 2", "Consultorio 3", "Consultorio 4"];

  const blocks: BookingBlock[] = [
    {
      id: "b1",
      room: "Consultorio 1",
      start: "10:00",
      end: "11:00",
      therapist: "Dra. Hernández",
      status: "Confirmada",
    },
    {
      id: "b2",
      room: "Consultorio 2",
      start: "12:00",
      end: "13:00",
      therapist: "Dr. Rodríguez",
      status: "Pendiente",
    },
    {
      id: "b3",
      room: "Consultorio 3",
      start: "16:00",
      end: "17:00",
      therapist: "Dra. López",
      status: "Completada",
    },
    {
      id: "b4",
      room: "Consultorio 4",
      start: "18:00",
      end: "19:00",
      therapist: "Dr. Pérez",
      status: "Cancelada",
    },
  ];

  const getColor = (s: BookingBlock["status"]) => {
    if (s === "Confirmada") return "bg-blue-600";
    if (s === "Pendiente") return "bg-yellow-500";
    if (s === "Completada") return "bg-green-600";
    return "bg-red-600";
  };

  const byRoom = useMemo(() => {
    const map: Record<string, BookingBlock[]> = {};
    rooms.forEach((r) => (map[r] = []));
    blocks.forEach((b) => map[b.room]?.push(b));
    return map;
  }, [date, location]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendario de Reservas"
        description="Vista tipo Google Calendar (maqueta)."
        right={
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="secondary">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Controles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-secondary mb-1">Fecha</div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Persistencia en localStorage (mencionado) - demo.
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-secondary mb-1">
                Ubicación / Sede
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="all">Todas</option>
                  <option value="roma">Sede Roma</option>
                  <option value="condesa">Sede Condesa</option>
                </Select>
              </div>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-secondary">
                Auto-refresh cada 5s · URL params: location/date/bookingCreated (demo)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grid</CardTitle>
          <p className="text-sm text-secondary mt-1">
            Eje X: horas (8:00–20:00) · Eje Y: consultorios. Click celda vacía → nueva reserva (demo).
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header row */}
              <div className="grid" style={{ gridTemplateColumns: `180px repeat(${HOURS.length}, 1fr)` }}>
                <div className="p-2 text-xs font-semibold text-secondary">Sala</div>
                {HOURS.map((h) => (
                  <div key={h} className="p-2 text-xs font-semibold text-secondary">
                    {String(h).padStart(2, "0")}:00
                  </div>
                ))}

                {/* Rows */}
                {rooms.map((room) => (
                  <React.Fragment key={room}>
                    <div className="p-2 text-sm font-medium text-default border-t border-default">
                      {room}
                    </div>

                    {HOURS.map((h) => {
                      const label = `${String(h).padStart(2, "0")}:00`;
                      const hasBlock = byRoom[room]?.some((b) => b.start === label);
                      const block = byRoom[room]?.find((b) => b.start === label);

                      return (
                        <div
                          key={`${room}-${h}`}
                          className="relative border-t border-default border-l border-default h-12"
                        >
                          {!hasBlock ? (
                            <button
                              type="button"
                              className="absolute inset-0 hover:bg-blue-50 transition-colors"
                              title="Nueva reserva"
                            />
                          ) : (
                            <div
                              className={`absolute inset-1 rounded-md text-white text-xs p-2 ${getColor(
                                block!.status,
                              )}`}
                              title={`${block!.therapist} · ${block!.start}-${block!.end} · ${block!.status}`}
                            >
                              <div className="font-semibold">{block!.therapist}</div>
                              <div className="opacity-90">
                                {block!.start}-{block!.end}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="info">Confirmadas</Badge>
            <Badge variant="warning">Pendientes</Badge>
            <Badge variant="success">Completadas</Badge>
            <Badge variant="danger">Canceladas</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
