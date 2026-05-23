import { useState, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import { Calendar, momentLocalizer, type View } from "react-big-calendar";
import moment from "moment";
import { Button, Input, Select, Card, CardContent } from "../ui";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { useLocationsQuery } from "../../../core/aplicacion/hooks/useLocationQueries";
import { useCubiculosActivosPorLocation } from "../../../core/aplicacion/hooks/useCubiculosQuery";
import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../../core/infraestructura/api/api";
import { showToast } from "../../../core/infraestructura/utilidades/toast";
import { ReservaForm, type ReservaFormConfirmData } from "../forms/ReservaForm";
import type { ReservaDTO, ReservaFilterRequestDTO } from "../../../core/dominio/tipos/api";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-dark.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const momentFn = (moment as unknown as { default: typeof moment }).default
    ? (moment as unknown as { default: typeof moment }).default
    : moment;

const localizer = momentLocalizer(momentFn);

type DateRange = { inicio: string; fin: string };

function calcDateRange(date: Date, view: View): DateRange {
  const m = momentFn(date);
  switch (view) {
    case "day":
      return { inicio: m.startOf("day").toISOString(), fin: m.endOf("day").toISOString() };
    case "week":
      return { inicio: m.startOf("week").toISOString(), fin: m.endOf("week").toISOString() };
    case "month":
      return { inicio: m.startOf("month").toISOString(), fin: m.endOf("month").toISOString() };
    default:
      return { inicio: m.startOf("day").toISOString(), fin: m.add(30, "day").toISOString() };
  }
}

const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DIAS_LARGOS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const formats = {
  dateFormat: "D",
  dayFormat: (date: Date) => `${DIAS_CORTOS[date.getDay()]} ${date.getDate()}`,
  weekdayFormat: (date: Date) => DIAS_CORTOS[date.getDay()],
  monthHeaderFormat: (date: Date) => `${MESES[date.getMonth()]} ${date.getFullYear()}`,
  dayHeaderFormat: (date: Date) => `${DIAS_LARGOS[date.getDay()]}, ${date.getDate()} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`,
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${start.getDate()} ${MESES[start.getMonth()]} – ${end.getDate()} ${MESES[end.getMonth()]} de ${end.getFullYear()}`,
  agendaDateFormat: (date: Date) => `${DIAS_CORTOS[date.getDay()]} ${date.getDate()} ${MESES[date.getMonth()]}`,
  agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${start.getDate()} ${MESES[start.getMonth()]} – ${end.getDate()} ${MESES[end.getMonth()]} ${end.getFullYear()}`,
  timeGutterFormat: "HH:mm",
  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")} – ${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
};
//
const DEBUG_USAR_DATOS_DEMO = false; //Si es true, utilizara los datos de prueba CalendarData, declarados aqui, en vez de llamar al backend.
const DEBUG_MOSTRAR_NOMBRES_DE_RESERVANTES = true; //Si es true, mostrata nombres completos de los usuarios en las reservas sin importar si el usuario loggeado sea admin o no.
const DEBUG_PERMITIR_EDICION = true; //Igual pero con la edicion.

type TimeSlotEntry = { id: number; nombre: string };
type CubiculoEntry = {
  id: number;
  nombre: string;
  slots: Record<string, TimeSlotEntry>;
};
type CalendarData = Record<string, Record<string, Record<string, CubiculoEntry>>>;

const demoData: CalendarData = {
  "Sede Roma": {
    "21-5-2026": {
      "Consultorio 1": {
        id: 1,
        nombre: "Consultorio 1",
        slots: {
          "09:00-10:00": { id: 1, nombre: "Ana García" },
          "11:00-12:00": { id: 2, nombre: "Carlos López" },
        },
      },
      "Consultorio 2": {
        id: 2,
        nombre: "Consultorio 2",
        slots: {
          "10:00-11:00": { id: 3, nombre: "María Fernández" },
          "14:00-15:00": { id: 4, nombre: "Pedro Sánchez" },
        },
      },
      "Consultorio 3": {
        id: 3,
        nombre: "Consultorio 3",
        slots: {
          "08:00-09:00": { id: 5, nombre: "Laura Martínez" },
          "13:00-14:00": { id: 6, nombre: "Diego Ramírez" },
        },
      },
    },
    "22-5-2026": {
      "Consultorio 1": {
        id: 1,
        nombre: "Consultorio 1",
        slots: {
          "10:00-11:00": { id: 7, nombre: "Sofía Torres" },
        },
      },
      "Consultorio 2": {
        id: 2,
        nombre: "Consultorio 2",
        slots: {
          "09:00-10:00": { id: 8, nombre: "Jorge Hernández" },
          "16:00-17:00": { id: 9, nombre: "Elena Díaz" },
        },
      },
    },
  },
  "Sede Condesa": {
    "21-5-2026": {
      "Consultorio A": {
        id: 4,
        nombre: "Consultorio A",
        slots: {
          "10:00-11:00": { id: 10, nombre: "Roberto Vega" },
          "12:00-13:00": { id: 11, nombre: "Patricia Ruiz" },
        },
      },
      "Consultorio B": {
        id: 5,
        nombre: "Consultorio B",
        slots: {
          "15:00-16:00": { id: 12, nombre: "Miguel Ángel" },
        },
      },
    },
    "22-5-2026": {
      "Consultorio A": {
        id: 4,
        nombre: "Consultorio A",
        slots: {
          "09:00-10:00": { id: 13, nombre: "Lucía Mendoza" },
        },
      },
    },
  },
};

interface CalendarEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  cubiculo?: string;
  cubiculoId?: number;
}

interface SlotInfo {
  start: Date;
  end: Date;
}

type CalendarView = View;

const VIEW_OPTIONS: { key: CalendarView; label: string }[] = [
  { key: "day", label: "Día" },
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
  { key: "agenda", label: "Agenda" },
];

function parseDateKey(dateStr: string): { d: number; m: number; y: number } {
  const [d, m, y] = dateStr.split("-").map(Number);
  return { d, m, y };
}

function parseTimeSlot(slot: string): { sh: number; sm: number; eh: number; em: number } {
  const [s, e] = slot.split("-");
  const [sh, sm] = s.split(":").map(Number);
  const [eh, em] = e.split(":").map(Number);
  return { sh, sm, eh, em };
}

function getEventsForSede(sede: string, data: CalendarData, mostrarNombresReservantes: boolean): CalendarEvent[] {
  const sedeData = data[sede];
  if (!sedeData) return [];

  const events: CalendarEvent[] = [];
  for (const [dateKey, cubiculos] of Object.entries(sedeData)) {
    const { d: day, m: month, y: year } = parseDateKey(dateKey);
    for (const [, cubObj] of Object.entries(cubiculos)) {
      for (const [slotKey, entry] of Object.entries(cubObj.slots)) {
        const { sh, sm, eh, em } = parseTimeSlot(slotKey);
        const start = new Date(year, month - 1, day, sh, sm);
        const end = new Date(year, month - 1, day, eh, em);
        const title = mostrarNombresReservantes ? entry.nombre : "";
        events.push({ id: `${sede}-${dateKey}-${cubObj.nombre}-${slotKey}`, title, start, end, cubiculo: cubObj.nombre, cubiculoId: cubObj.id });
      }
    }
  }
  return events;
}

function getCubiculosForSede(sede: string, data: CalendarData): { id: number; nombre: string }[] {
  const sedeData = data[sede];
  if (!sedeData) return [];
  const map = new Map<number, string>();
  for (const cubiculos of Object.values(sedeData)) {
    for (const cub of Object.values(cubiculos)) {
      if (!map.has(cub.id)) {
        map.set(cub.id, cub.nombre);
      }
    }
  }
  return Array.from(map.entries())
    .map(([id, nombre]) => ({ id, nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

function getAllCubiculos(data: CalendarData): { id: number; nombre: string; sede: string }[] {
  const map = new Map<number, { nombre: string; sede: string }>();
  for (const [sede, fechas] of Object.entries(data)) {
    for (const cubiculos of Object.values(fechas)) {
      for (const cub of Object.values(cubiculos)) {
        if (!map.has(cub.id)) {
          map.set(cub.id, { nombre: cub.nombre, sede });
        }
      }
    }
  }
  return Array.from(map.entries())
    .map(([id, { nombre, sede }]) => ({ id, nombre, sede }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

const sedes = Object.keys(demoData);
const defaultSede = DEBUG_USAR_DATOS_DEMO ? (sedes[0] ?? "") : "";

interface BookingsCalendarProps {
  className?: string;
}

export interface BookingsCalendarHandle {
  openCreateForm: () => void;
}

const maxCalendarioAnchuraPixeles = 700;
const minCalendarioAnchuraPixelesCard = maxCalendarioAnchuraPixeles + 100;

export const BookingsCalendar = forwardRef<BookingsCalendarHandle, BookingsCalendarProps>(({ className }, ref) => {
  const { isAdmin } = useAuth();

  const [selectedSede, setSelectedSede] = useState(defaultSede);
  const [selectedCubiculo, setSelectedCubiculo] = useState<string>("");
  const [customEventsBySede, setCustomEventsBySede] = useState<Record<string, CalendarEvent[]>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [tempSlot, setTempSlot] = useState<SlotInfo | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDraggingOverlap, setDraggingOverlap] = useState(false);
  const [slotGeneration, setSlotGeneration] = useState(0);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const formatDateToInput = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatTime = (date: Date) =>
    `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  const mostrarNombresReservantes = isAdmin() || DEBUG_MOSTRAR_NOMBRES_DE_RESERVANTES;
  const puedeEditar = isAdmin() || DEBUG_PERMITIR_EDICION;

  const { data: locations = [] } = useLocationsQuery();
  const { data: cubiculosApi = [] } = useCubiculosActivosPorLocation(
    !DEBUG_USAR_DATOS_DEMO && selectedSede ? Number(selectedSede) : null,
  );

  const dateRange = useMemo(
    () => calcDateRange(currentDate, currentView),
    [currentDate, currentView],
  );

  const { data: reservasApi = [] } = useQuery({
    queryKey: ["reservas", "calendario", dateRange, selectedSede],
    queryFn: async (): Promise<ReservaDTO[]> => {
      const params: ReservaFilterRequestDTO = {
        fechaInicio: dateRange.inicio,
        fechaFin: dateRange.fin,
        locationIds: selectedSede ? [Number(selectedSede)] : undefined,
        cubiculoIds: selectedCubiculo ? [Number(selectedCubiculo)] : undefined,
      };
      const res = await authAPI.reservas.getByFilter(params);
      return res.data;
    },
    enabled: !DEBUG_USAR_DATOS_DEMO,
    staleTime: 1000 * 60 * 2,
  });

  const allCubiculos = useMemo(
    () => getAllCubiculos(demoData).map((c) => ({ ...c, precioPorHora: 450 })),
    [],
  );

  const cubiculos = useMemo(() => {
    if (DEBUG_USAR_DATOS_DEMO) {
      return getCubiculosForSede(selectedSede, demoData);
    }
    return cubiculosApi.map((c) => ({ id: Number(c.id), nombre: c.nombre }));
  }, [selectedSede, cubiculosApi]);

  const baseEvents = useMemo(
    () => getEventsForSede(selectedSede, demoData, mostrarNombresReservantes),
    [selectedSede, mostrarNombresReservantes],
  );

  const apiEvents = useMemo(
    () => reservasApi.map((r) => ({
      id: r.id,
      title: mostrarNombresReservantes ? r.psicologoNombreCompleto : "",
      start: new Date(r.inicio),
      end: new Date(r.fin),
      cubiculo: r.cubiculoNombre,
      cubiculoId: r.cubiculoId,
    })),
    [reservasApi, mostrarNombresReservantes],
  );

  const filteredBaseEvents = useMemo(
    () => selectedCubiculo ? baseEvents.filter((e) => e.cubiculoId === Number(selectedCubiculo)) : baseEvents,
    [baseEvents, selectedCubiculo],
  );

  const apiEventsFiltered = useMemo(
    () => selectedCubiculo
      ? apiEvents.filter((e) => e.cubiculoId === Number(selectedCubiculo))
      : apiEvents,
    [apiEvents, selectedCubiculo],
  );

  const customEvents = customEventsBySede[selectedSede] ?? [];

  const filteredCustomEvents = useMemo(
    () => selectedCubiculo
      ? customEvents.filter((e) => e.cubiculoId === Number(selectedCubiculo))
      : customEvents,
    [customEvents, selectedCubiculo],
  );

  const events = useMemo(
    () => [
      ...(DEBUG_USAR_DATOS_DEMO ? filteredBaseEvents : apiEventsFiltered),
      ...filteredCustomEvents,
    ],
    [filteredBaseEvents, apiEventsFiltered, filteredCustomEvents],
  );

  const moveIsInvalid = useCallback(
      (newStart: Date, newEnd: Date, ignoreId: number | string | null = null): boolean => {
        return events.some((event) => {
          if (event.id === ignoreId) return false;
          return newStart < event.end && newEnd > event.start;
        });
      },
      [events]
  );

  const findConflictingEvent = useCallback(
      (newStart: Date, newEnd: Date, ignoreId: number | string | null = null): CalendarEvent | undefined => {
        return events.find((event) => {
          if (event.id === ignoreId) return false;
          return newStart < event.end && newEnd > event.start;
        });
      },
      [events]
  );

  const handleSelecting = useCallback(
      (range: { start: Date; end: Date }): boolean | undefined => {
        setDraggingOverlap(moveIsInvalid(range.start, range.end));
        return undefined;
      },
      [moveIsInvalid]
  );

  const onSelectSlot = useCallback(
      ({ start, end }: SlotInfo) => {
        setDraggingOverlap(false);
        if (currentView === "month") {
          setCurrentDate(start);
          setCurrentView("day");
          return;
        }
        const conflict = findConflictingEvent(start, end);
        if (conflict) {
          const inicioStr = momentFn(conflict.start).format("HH:mm");
          const finStr = momentFn(conflict.end).format("HH:mm");
          const cubiculo = conflict.cubiculo ?? "Desconocido";
          showToast.error(`Hay traslape con otra reserva de ${inicioStr} a ${finStr}, en el cubículo "${cubiculo}"`);
          return;
        }
        setTempSlot({ start, end });
        setSlotGeneration(g => g + 1);
        setModalOpen(true);
      },
      [findConflictingEvent, currentView]
  );

  const onSelectEvent = useCallback(
      (event: CalendarEvent) => {
        if (currentView === "month" || currentView === "agenda") {
          setCurrentDate(event.start);
          setCurrentView("day");
          return;
        }
        if (puedeEditar) {
          setEditingEvent(event);
          setTempSlot({ start: event.start, end: event.end });
          setSlotGeneration(g => g + 1);
          setModalOpen(true);
        }
      },
      [currentView, puedeEditar]
  );

  const onDrillDown = useCallback(
      (date: Date) => {
        setCurrentDate(date);
        setCurrentView("day");
      },
      []
  );

  const navigate = useCallback((action: "PREV" | "NEXT" | "TODAY") => {
      const unit = currentView === "week" ? "week" : currentView === "month" ? "month" : "day";
      if (action === "TODAY") {
        setCurrentDate(new Date());
      } else if (action === "PREV") {
        setCurrentDate((d) => momentFn(d).subtract(1, unit).toDate());
      } else {
        setCurrentDate((d) => momentFn(d).add(1, unit).toDate());
      }
  }, [currentView]);

  const formattedDate = (() => {
    const d = currentDate;
    if (currentView === "day") {
      return `${DIAS_LARGOS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
    }
    if (currentView === "week") {
      const start = momentFn(currentDate).startOf("week").toDate();
      const end = momentFn(currentDate).endOf("week").toDate();
      return `${start.getDate()} ${MESES[start.getMonth()]} – ${end.getDate()} ${MESES[end.getMonth()]} de ${end.getFullYear()}`;
    }
    if (currentView === "month") {
      return `${MESES[d.getMonth()]} de ${d.getFullYear()}`;
    }
    return `${DIAS_LARGOS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
  })();

  const handleFormConfirm = useCallback(
    (data: ReservaFormConfirmData) => {
      if (editingEvent) {
        setModalOpen(false);
        setEditingEvent(null);
        return;
      }

      const start = new Date(data.inicio);
      const end = new Date(data.fin);

      const newEvent: CalendarEvent = {
        id: Math.random(),
        title: data.usuarioNombre,
        start,
        end,
        cubiculo: data.cubiculoNombre,
        cubiculoId: data.cubiculoId,
      };

      setCustomEventsBySede((prev) => ({
        ...prev,
        [data.sede]: [...(prev[data.sede] ?? []), newEvent],
      }));

      setCurrentDate(start);
      setCurrentView("day");
      setSelectedSede(data.sede);
      setSelectedCubiculo(String(data.cubiculoId));
      setModalOpen(false);
      setTempSlot(null);
    },
    [editingEvent],
  );

  const handleCloseForm = useCallback(() => {
    setModalOpen(false);
    setEditingEvent(null);
  }, []);

  useImperativeHandle(ref, () => ({
    openCreateForm: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
      setTempSlot({ start, end });
      setSlotGeneration(g => g + 1);
      setModalOpen(true);
    },
  }), []);

  return (
      <Card className={className}>
        <CardContent className="p-0" style={{ height: minCalendarioAnchuraPixelesCard }}>
        <div className="flex flex-col h-full">
          <style dangerouslySetInnerHTML={{
            __html: `.rbc-day-slot .rbc-event { flex-flow: column !important; }
.rbc-day-slot .rbc-event-label { width: 100%; }
.rbc-timeslot-group { min-height: 70px; }
.rbc-event, .rbc-day-slot .rbc-background-event { background-color: rgb(var(--primary)) !important; }`,
          }} />
          {isDraggingOverlap && (
            <style dangerouslySetInnerHTML={{
              __html: `.rbc-slot-selection { background-color: rgba(255, 0, 0, 0.3) !important; }`,
            }} />
          )}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-default bg-surface">
          <div className="flex items-center gap-1.5">
            <Select
              value={selectedSede}
              onChange={(e) => {
                setSelectedSede(e.target.value);
                setSelectedCubiculo("");
              }}
              className="w-44"
            >
              {DEBUG_USAR_DATOS_DEMO ? (
                sedes.map((sede) => (
                  <option key={sede} value={sede}>{sede}</option>
                ))
              ) : (
                <>
                  <option value="">Todas las sedes</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={String(loc.id)}>{loc.name}</option>
                  ))}
                </>
              )}
            </Select>
            <Select
              value={selectedCubiculo}
              onChange={(e) => setSelectedCubiculo(e.target.value)}
              className="w-44"
            >
              <option value="">Todos los consultorios</option>
              {cubiculos.map((cub) => (
                <option key={cub.id} value={cub.id}>{cub.nombre}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-default bg-surface">
          <div className="flex items-center gap-1.5">
            <Button variant="secondary" onClick={() => navigate("PREV")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => navigate("TODAY")}>
              Hoy
            </Button>
            <Button variant="secondary" onClick={() => navigate("NEXT")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Input
              type="date"
              className="w-40"
              value={momentFn(currentDate).format("YYYY-MM-DD")}
              onChange={(e) => {
                if (e.target.value) {
                  setCurrentDate(new Date(e.target.value + "T12:00:00"));
                }
              }}
            />
          </div>

          <span className="text-sm font-medium text-default">
            {formattedDate}
          </span>

          <div className="flex items-center gap-1.5">
            {VIEW_OPTIONS.map(({ key, label }) => (
              <Button
                key={key}
                variant={currentView === key ? "primary" : "secondary"}
                onClick={() => setCurrentView(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <Calendar
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            className="flex-1 min-h-0"
            dayLayoutAlgorithm="no-overlap"
            localizer={localizer}
            culture="es"
            formats={formats}
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 21, 0, 0)}
            messages={{
              today: "Hoy",
              previous: "Anterior",
              next: "Siguiente",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda",
              date: "Fecha",
              time: "Hora",
              event: "Usuario",
              noEventsInRange: "No hay usuarios en este rango",
              showMore: (count: number) => `+${count} más`,
            }}
            events={events}
            step={60}
            timeslots={1}
            selectable
            onSelectSlot={onSelectSlot}
            onSelecting={handleSelecting}
            onSelectEvent={onSelectEvent}
            onDrillDown={onDrillDown}
            toolbar={false}
            style={{ maxHeight: maxCalendarioAnchuraPixeles }}
        />

        <ReservaForm
          key={slotGeneration}
          open={modalOpen}
          onOpenChange={handleCloseForm}
          mode={editingEvent ? "edit" : "create"}
          defaultFecha={tempSlot ? formatDateToInput(tempSlot.start) : ""}
          defaultHoraInicio={tempSlot ? formatTime(tempSlot.start) : "09:00"}
          defaultHoraFin={tempSlot ? formatTime(tempSlot.end) : "10:00"}
          defaultCubiculoId={selectedCubiculo ? Number(selectedCubiculo) : undefined}
          defaultUsuarioNombre={editingEvent?.title}
          cubiculos={allCubiculos}
          onConfirm={handleFormConfirm}
        />
      </div>
      </CardContent>
      </Card>
  );
});
BookingsCalendar.displayName = "BookingsCalendar";
