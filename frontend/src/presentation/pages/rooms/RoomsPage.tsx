import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../components/ui";

export const RoomsPage: React.FC = () => {
  const locations = [
    {
      id: 1,
      name: "Sede Roma",
      address: "Av. Insurgentes 123, CDMX",
      description: "Ambiente tranquilo y accesible.",
      imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: 2,
      name: "Sede Condesa",
      address: "Calle Ámsterdam 45, CDMX",
      description: "Ubicación céntrica con salas equipadas.",
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=60",
    },
  ];

  const gradients = [
    "from-blue-600/80 to-blue-700/80",
    "from-purple-600/80 to-purple-700/80",
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Centros de Consulta"
        description="Selecciona una sede y revisa disponibilidad de consultorios."
        right={
          <div className="flex gap-2">
            <Button variant="secondary">
              <Calendar className="h-4 w-4 mr-2" />
              Calendario
            </Button>
            <Button variant="secondary">Mis Reservas</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {locations.map((loc, idx) => {
          const gradient = gradients[idx % gradients.length];
          return (
            <Card key={loc.id} className="overflow-hidden">
              <div
                className="h-44 bg-cover bg-center"
                style={{ backgroundImage: `url(${loc.imageUrl})` }}
              >
                <div className={`h-full w-full bg-gradient-to-br ${gradient} p-4 flex flex-col justify-end`}>
                  <div className="text-white">
                    <div className="text-xl font-bold">{loc.name}</div>
                    <div className="text-sm opacity-90 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {loc.address}
                    </div>
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle>Acerca de la sede</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{loc.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Button>Ver disponibilidad</Button>
                  <Button variant="secondary">Más información</Button>
                </div>
                <div className="text-xs text-gray-500">
                  Navegación: usa parámetros URL /bookings?location=... (mencionado) · demo
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty states (texto del documento) */}
      <div className="hidden">
        <Card>
          <CardContent>
            <div className="py-10 text-center text-gray-600">
              No hay centros de consulta disponibles en este momento.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
