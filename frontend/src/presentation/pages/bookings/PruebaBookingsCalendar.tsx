import React from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { BookingsCalendar } from "../../components/reservas/BookingsCalendar";

export const PruebaBookingsCalendar: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Prueba de calendario de reserva"
        description="Entorno de prueba para el componente BookingsCalendar"
      />
      <BookingsCalendar />
    </div>
  );
};
