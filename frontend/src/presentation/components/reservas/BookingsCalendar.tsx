import { useState, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import { Calendar, momentLocalizer, type View } from "react-big-calendar";
import moment from "moment";
import { Button, Input, Select, Card, CardContent } from "../ui";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../../core/infraestructura/api/api";
import { showToast } from "../../../core/infraestructura/utilidades/toast";
import { ReservaForm, type ReservaFormConfirmData } from "../forms/ReservaForm";
import type { ReservaDTO, ReservaFilterRequestDTO, LocationResponseDTO, CubiculoResponse } from "../../../core/dominio/tipos/api";
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
const DEBUG_MOSTRAR_NOMBRES_DE_RESERVANTES = true;
const DEBUG_PERMITIR_EDICION = true;

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

  const [selectedSede, setSelectedSede] = useState("");
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

  const { data: locations = [] } = useQuery({
    queryKey: ["locations", "active"],
    queryFn: async (): Promise<LocationResponseDTO[]> => {
      const res = await authAPI.locations.getAllActive();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: cubiculosApi = [] } = useQuery({
    queryKey: ["cubiculos", "active-public", selectedSede],
    queryFn: async (): Promise<CubiculoResponse[]> => {
      const res = await authAPI.cubiculos.getActiveByLocationPublic(Number(selectedSede));
      return res.data;
    },
    enabled: !!selectedSede,
    staleTime: 1000 * 60 * 5,
  });

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
    enabled: true,
    staleTime: 1000 * 60 * 2,
  });

  const allCubiculos = useMemo(() => {
    if (!selectedSede) return [];
    const sedeName = locations.find(l => String(l.id) === selectedSede)?.name ?? `Sede ${selectedSede}`;
    return cubiculosApi.map(c => ({
      id: c.id,
      nombre: c.nombre,
      sede: sedeName,
      precioPorHora: c.precio,
    }));
  }, [cubiculosApi, locations, selectedSede]);

  const cubiculos = useMemo(
    () => cubiculosApi.map((c) => ({ id: c.id, nombre: c.nombre })),
    [cubiculosApi],
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
    () => [...apiEventsFiltered, ...filteredCustomEvents],
    [apiEventsFiltered, filteredCustomEvents],
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
        [selectedSede]: [...(prev[selectedSede] ?? []), newEvent],
      }));

      setCurrentDate(start);
      setCurrentView("day");
      setSelectedCubiculo(String(data.cubiculoId));
      setModalOpen(false);
      setTempSlot(null);
    },
    [editingEvent, selectedSede],
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
              <option value="">Todas las sedes</option>
              {locations.map((loc) => (
                <option key={loc.id} value={String(loc.id)}>{loc.name}</option>
              ))}
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
