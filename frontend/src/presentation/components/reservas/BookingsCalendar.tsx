import React, { useState, useCallback, useEffect, useRef } from "react";
import { Calendar, momentLocalizer, type View } from "react-big-calendar";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui";

import "react-big-calendar/lib/css/react-big-calendar.css";

const momentFn = (moment as unknown as { default: typeof moment }).default
    ? (moment as unknown as { default: typeof moment }).default
    : moment;

const localizer = momentLocalizer(momentFn);

interface CalendarEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
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

interface BookingsCalendarProps {
  className?: string;
}

export const BookingsCalendar: React.FC<BookingsCalendarProps> = ({ className }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "Evento fijo",
      start: new Date(2025, 11, 2, 10, 0),
      end: new Date(2025, 11, 2, 11, 0),
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [tempSlot, setTempSlot] = useState<SlotInfo | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modalOpen) {
      inputRef.current?.focus();
    }
  }, [modalOpen]);

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

    setEvents((prev) => [...prev, newEvent]);
    setModalOpen(false);
    setTempSlot(null);
  };

  const handleCancel = (): void => {
    setModalOpen(false);
    setTempSlot(null);
  };

  return (
      <div className={`flex flex-col ${className ?? ""}`}>
        {/* External toolbar */}
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
            style={{ minHeight: 400 }}
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
  );
};