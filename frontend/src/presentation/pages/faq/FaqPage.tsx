import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, Input } from "../../components/ui";

const FAQ_ITEMS = [
  {
    q: "¿Qué es SATI Centro de Consulta?",
    a: "SATI es una plataforma para administrar reservaciones, pagos y documentación en centros de consulta.\n\nIncluye calendario, historial de pagos y herramientas para administradores.",
  },
  {
    q: "¿Cómo realizo una cita en un cubículo?",
    a: "Ingresa a Centros de Consulta, revisa disponibilidad, elige sala, fecha y horario.\n\nRecibirás confirmación por correo.",
  },
  {
    q: "¿Cómo se manejan los pagos y recibos?",
    a: "Los pagos se registran por reserva o suscripción. Desde tu cuenta podrás consultar historial y descargar comprobantes.",
  },
  {
    q: "¿Dónde subo mi documentación?",
    a: "En Mi Perfil encontrarás la sección de Documentos. Ahí puedes subir identificación oficial y título profesional para validación.",
  },
  {
    q: "¿Qué pasa si no pago mis reservas a tiempo?",
    a: "Pueden aplicarse restricciones temporales y degradación de usuario según políticas del sistema.",
  },
  {
    q: "¿Qué pasa si pagué fuera de la aplicación?",
    a: "Puedes reportarlo al administrador. El admin puede registrar pagos manuales con referencia/comprobante.",
  },
];

export const FaqPage: React.FC = () => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(
      (item) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Preguntas Frecuentes"
        description="Encuentra respuestas rápidas sobre el uso de la plataforma."
      />

      <div className="max-w-2xl">
        <div className="relative">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className="pl-9"
          />
        </div>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent>
            <div className="py-10 text-center text-secondary">
              No se encontraron resultados para tu búsqueda.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {results.map((item) => (
            <Card key={item.q}>
              <CardHeader>
                <CardTitle className="text-base">{item.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-secondary whitespace-pre-line">
                  {item.a}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
