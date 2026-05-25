import React, { useRef } from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { BookingsCalendar, type BookingsCalendarHandle } from "../../components/reservas/BookingsCalendar";
import { Button } from "../../components/ui";
import { Plus } from "lucide-react";

export const PruebaBookingsCalendar: React.FC = () => {
  const calendarRef = useRef<BookingsCalendarHandle>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prueba de calendario de reserva"
        description="Entorno de prueba para el componente BookingsCalendar"
      />
      <BookingsCalendar ref={calendarRef} />
      <Button
        onClick={() => calendarRef.current?.openCreateForm()}
        className="fixed bottom-6 right-6 h-17 w-17 !rounded-full !p-0 flex items-center justify-center shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};
