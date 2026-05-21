    import React from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { Card, CardContent } from "../../components/ui";
import { BookingsCalendar } from "../../components/reservas/BookingsCalendar";

export const PruebaBookingsCalendar: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Prueba de calendario de reserva"
        description="Entorno de prueba para el componente BookingsCalendar"
      />
      <Card>
        <CardContent className="p-0 h-[600px]">
          <BookingsCalendar className="h-full" />
        </CardContent>
      </Card>
    </div>
  );
};
