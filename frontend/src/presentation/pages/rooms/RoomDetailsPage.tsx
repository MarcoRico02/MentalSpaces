import React from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "../../components/ui";

export const RoomDetailsPage: React.FC = () => {
  const features = [
    "Insonorizado",
    "Aire acondicionado",
    "WiFi",
    "Con ventana",
    "Iluminación cálida",
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detalles del Consultorio"
        description="Información de sala + calendario de disponibilidad (maqueta)."
        right={
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div
          className="h-64 md:h-80 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=60)",
          }}
        />
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <div className="text-2xl font-bold text-gray-900">Consultorio 3</div>
              <div className="text-sm text-gray-600 mt-1">
                Sala cómoda para terapia individual y online.
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Precio por hora</div>
              <div className="text-2xl font-bold text-gray-900">$450</div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-md bg-gray-50 p-4">
              <div className="text-sm text-gray-600">Ubicación (sede)</div>
              <div className="font-semibold text-gray-900">Sede Roma</div>
            </div>
            <div className="rounded-md bg-gray-50 p-4">
              <div className="text-sm text-gray-600">ID de sala</div>
              <div className="font-semibold text-gray-900">RM-003</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              Características
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <Badge key={f} variant="outline">
                  {f}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Disponibilidad
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Componente BookingCalendar + modal de confirmación (maqueta).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
            BookingCalendar iría aquí.\n\nClick en slot disponible → abrir modal de reserva.
          </div>
          <div className="flex gap-2">
            <Button>Reservar</Button>
            <Button variant="secondary">Scroll al calendario</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
