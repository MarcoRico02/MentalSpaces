import React, { useMemo, useState } from "react";
import { Calendar, Mail, Phone, Search } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  Input,
  Skeleton,
} from "../../components/ui";

type Therapist = {
  id: number;
  fullName: string;
  username: string;
  specialty: string;
  phone: string;
  email: string;
  tags: string[];
};

export const TherapistsPage: React.FC = () => {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const therapists: Therapist[] = [
    {
      id: 1,
      fullName: "Dra. Sofía Hernández",
      username: "sofiahernandez",
      specialty: "Ansiedad y depresión",
      phone: "+52 55 0000 0001",
      email: "sofia@sati.mx",
      tags: ["Adultos", "Ansiedad", "Depresión"],
    },
    {
      id: 2,
      fullName: "Dr. Rodrigo Rodríguez",
      username: "drrodriguez",
      specialty: "Terapia cognitivo-conductual",
      phone: "+52 55 0000 0002",
      email: "rodrigo@sati.mx",
      tags: ["TCC", "Estrés", "Hábitos"],
    },
    {
      id: 3,
      fullName: "Dra. Laura López",
      username: "lauralopez",
      specialty: "Terapia familiar",
      phone: "+52 55 0000 0003",
      email: "laura@sati.mx",
      tags: ["Familia", "Pareja", "Comunicación"],
    },
    {
      id: 4,
      fullName: "Dr. Juan Pérez",
      username: "juanperez",
      specialty: "Duelo",
      phone: "+52 55 0000 0004",
      email: "juan@sati.mx",
      tags: ["Duelo", "Adultos"],
    },
  ];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return therapists;
    return therapists.filter(
      (t) =>
        t.fullName.toLowerCase().includes(s) ||
        t.username.toLowerCase().includes(s) ||
        t.specialty.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Terapeutas"
        description="Conoce a nuestro equipo de profesionales (maqueta)."
      />

      <div className="max-w-xl">
        <div className="relative">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, usuario o especialidad..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Skeleton demo */}
      <div className="hidden grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton lines={4} />
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent>
            <div className="py-10 text-center text-secondary">
              No se encontraron terapeutas con esa búsqueda.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-surface-3 flex items-center justify-center text-secondary font-semibold">
                    {t.fullName
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-default">
                      {t.fullName}
                    </div>
                    <div className="text-sm text-secondary">{t.specialty}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-secondary space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t.email}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full" onClick={() => setOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Sesión
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Agendar sesión"
        description="BookingModal (maqueta)"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
            <Button>Confirmar</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-md border border-dashed border-default bg-app p-6 text-center text-secondary">
            Aquí iría el BookingModal para seleccionar fecha/sala/horario (demo).
          </div>
        </div>
      </Dialog>
    </div>
  );
};
