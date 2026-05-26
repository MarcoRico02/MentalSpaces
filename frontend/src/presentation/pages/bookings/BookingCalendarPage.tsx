import React, { useRef } from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { BookingsCalendar, type BookingsCalendarHandle } from "../../components/reservas/BookingsCalendar";
import { Button } from "../../components/ui";
import { Plus } from "lucide-react";

export const BookingCalendarPage: React.FC = () => {
  const calendarRef = useRef<BookingsCalendarHandle>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendario de Reservas"
        description="Vista general del calendario de reservas por consultorio"
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
