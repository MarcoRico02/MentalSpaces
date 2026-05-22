import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Calendar, momentLocalizer, type View } from "react-big-calendar";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Input, Select, Card, CardContent } from "../ui";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";

import "react-big-calendar/lib/css/react-big-calendar.css";

const momentFn = (moment as unknown as { default: typeof moment }).default
    ? (moment as unknown as { default: typeof moment }).default
    : moment;

const localizer = momentLocalizer(momentFn);

const DEBUG_MOSTRAR_NOMBRES_DE_RESERVANTES = true;

type TimeSlotEntry = { id: number; nombre: string };
type CalendarData = Record<string, Record<string, Record<string, Record<string, TimeSlotEntry>>>>;

const demoData: CalendarData = {
  "Sede Roma": {
    "21-5-2026": {
      "Consultorio 1": {
        "09:00-10:00": { id: 1, nombre: "Ana García" },
        "11:00-12:00": { id: 2, nombre: "Carlos López" },
      },
      "Consultorio 2": {
        "10:00-11:00": { id: 3, nombre: "María Fernández" },
        "14:00-15:00": { id: 4, nombre: "Pedro Sánchez" },
      },
      "Consultorio 3": {
        "08:00-09:00": { id: 5, nombre: "Laura Martínez" },
        "13:00-14:00": { id: 6, nombre: "Diego Ramírez" },
      },
    },
    "22-5-2026": {
      "Consultorio 1": {
        "10:00-11:00": { id: 7, nombre: "Sofía Torres" },
      },
      "Consultorio 2": {
        "09:00-10:00": { id: 8, nombre: "Jorge Hernández" },
        "16:00-17:00": { id: 9, nombre: "Elena Díaz" },
      },
    },
  },
  "Sede Condesa": {
    "21-5-2026": {
      "Consultorio A": {
        "10:00-11:00": { id: 10, nombre: "Roberto Vega" },
        "12:00-13:00": { id: 11, nombre: "Patricia Ruiz" },
      },
      "Consultorio B": {
        "15:00-16:00": { id: 12, nombre: "Miguel Ángel" },
      },
    },
    "22-5-2026": {
      "Consultorio A": {
        "09:00-10:00": { id: 13, nombre: "Lucía Mendoza" },
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
}

interface SlotInfo {
  start: Date;
  end: Date;
}

type CalendarView = View;

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0 20px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  btnCancel: {
    padding: "8px 16px",
    border: "1px solid #ccc",
    background: "transparent",
    borderRadius: "4px",
    cursor: "pointer",
  },
  btnSave: {
    padding: "8px 16px",
    border: "none",
    background: "#3174ad",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

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
    for (const [cub, slots] of Object.entries(cubiculos)) {
      for (const [slotKey, entry] of Object.entries(slots)) {
        const { sh, sm, eh, em } = parseTimeSlot(slotKey);
        const start = new Date(year, month - 1, day, sh, sm);
        const end = new Date(year, month - 1, day, eh, em);
        const title = mostrarNombresReservantes ? entry.nombre : "";
        events.push({ id: `${sede}-${dateKey}-${cub}-${slotKey}`, title, start, end, cubiculo: cub });
      }
    }
  }
  return events;
}

function getCubiculosForSede(sede: string, data: CalendarData): string[] {
  const sedeData = data[sede];
  if (!sedeData) return [];
  const cubiculosSet = new Set<string>();
  for (const cubiculos of Object.values(sedeData)) {
    for (const cub of Object.keys(cubiculos)) {
      cubiculosSet.add(cub);
    }
  }
  return [...cubiculosSet].sort();
}

const sedes = Object.keys(demoData);
const defaultSede = sedes[0] ?? "";

interface BookingsCalendarProps {
  className?: string;
}

const maxCalendarioAnchuraPixeles = 800;
const minCalendarioAnchuraPixelesCard = maxCalendarioAnchuraPixeles + 100;

export const BookingsCalendar: React.FC<BookingsCalendarProps> = ({ className }) => {
  const { isAdmin } = useAuth();

  const [selectedSede, setSelectedSede] = useState(defaultSede);
  const [selectedCubiculo, setSelectedCubiculo] = useState("");
  const [customEventsBySede, setCustomEventsBySede] = useState<Record<string, CalendarEvent[]>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [tempSlot, setTempSlot] = useState<SlotInfo | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedCubiculo("");
  }, [selectedSede]);

  useEffect(() => {
    if (modalOpen) {
      inputRef.current?.focus();
    }
  }, [modalOpen]);

  const mostrarNombresReservantes = isAdmin() || DEBUG_MOSTRAR_NOMBRES_DE_RESERVANTES;

  const cubiculos = useMemo(
    () => getCubiculosForSede(selectedSede, demoData),
    [selectedSede],
  );

  const baseEvents = useMemo(
    () => getEventsForSede(selectedSede, demoData, mostrarNombresReservantes),
    [selectedSede, mostrarNombresReservantes],
  );

  const filteredBaseEvents = useMemo(
    () => selectedCubiculo ? baseEvents.filter((e) => e.cubiculo === selectedCubiculo) : baseEvents,
    [baseEvents, selectedCubiculo],
  );

  const customEvents = customEventsBySede[selectedSede] ?? [];

  const events = useMemo(
    () => [...filteredBaseEvents, ...customEvents],
    [filteredBaseEvents, customEvents],
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

  const onSelectSlot = useCallback(
      ({ start, end }: SlotInfo) => {
        if (moveIsInvalid(start, end)) {
          alert("No puedes crear un evento encima de otro.");
          return;
        }
        setTempSlot({ start, end });
        setTitle("");
        setModalOpen(true);
      },
      [moveIsInvalid]
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
    if (currentView === "day") {
      return momentFn(currentDate).format("D [de] MMMM [de] YYYY");
    }
    if (currentView === "week") {
      const start = momentFn(currentDate).startOf("week");
      const end = momentFn(currentDate).endOf("week");
      return `${start.format("D MMM")} – ${end.format("D MMM [de] YYYY")}`;
    }
    if (currentView === "month") {
      return momentFn(currentDate).format("MMMM [de] YYYY");
    }
    return momentFn(currentDate).format("D MMMM [de] YYYY");
  })();

  const handleSave = (): void => {
    if (!title.trim()) {
      alert("Por favor escribe un nombre");
      return;
    }
    if (!tempSlot) return;

    const newEvent: CalendarEvent = {
      id: Math.random(),
      title,
      start: tempSlot.start,
      end: tempSlot.end,
    };

    setCustomEventsBySede((prev) => ({
      ...prev,
      [selectedSede]: [...(prev[selectedSede] ?? []), newEvent],
    }));
    setModalOpen(false);
    setTempSlot(null);
  };

  const handleCancel = (): void => {
    setModalOpen(false);
    setTempSlot(null);
  };

  return (
      <Card className={className}>
        <CardContent className="p-0" style={{ height: minCalendarioAnchuraPixelesCard }}>
        <div className="flex flex-col h-full">
          <style>{`.rbc-day-slot .rbc-event { flex-flow: column !important; }
.rbc-day-slot .rbc-event-label { width: 100%; }
.rbc-timeslot-group { min-height: 70px; }`}</style>
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-default bg-surface">
          <div className="flex items-center gap-1.5">
            <Select
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              className="w-44"
            >
              {sedes.map((sede) => (
                <option key={sede} value={sede}>{sede}</option>
              ))}
            </Select>
            <Select
              value={selectedCubiculo}
              onChange={(e) => setSelectedCubiculo(e.target.value)}
              className="w-44"
            >
              <option value="">Todos los consultorios</option>
              {cubiculos.map((cub) => (
                <option key={cub} value={cub}>{cub}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-default bg-surface">
          <div className="flex items-center gap-1.5">
            <Button variant="secondary" onClick={() => navigate("PREV")}>
              <ChevronLeft className="h-4 w-4" />
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
            events={events}
            step={60}
            timeslots={1}
            selectable
            onSelectSlot={onSelectSlot}
            toolbar={false}
            style={{ maxHeight: maxCalendarioAnchuraPixeles }}
        />

        {modalOpen && (
            <div style={styles.overlay}>
              <div style={styles.modal}>
                <h3>Nueva Reserva</h3>
                <p style={{ fontSize: "0.9em", color: "#666" }}>
                  {momentFn(tempSlot?.start).format("HH:mm")} –{" "}
                  {momentFn(tempSlot?.end).format("HH:mm")}
                </p>

                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Nombre del cliente..."
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTitle(e.target.value)
                    }
                    style={styles.input}
                />

                <div style={styles.buttons}>
                  <button onClick={handleCancel} style={styles.btnCancel}>
                    Cancelar
                  </button>
                  <button onClick={handleSave} style={styles.btnSave}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
      </CardContent>
      </Card>
  );
};
