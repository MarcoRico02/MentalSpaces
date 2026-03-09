import React from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from "../../components/ui";

export const TherapistProfilePage: React.FC = () => {
  // Demo hardcoded mencionado
  const user = {
    id: 1,
    username: "drrodriguez",
    fullName: "Dr. Rodriguez",
    role: "therapist",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perfil de Terapeuta"
        description="Página demo/hardcoded (maqueta)."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-surface-3 flex items-center justify-center font-semibold text-secondary">
                {user.fullName
                  .split(" ")
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join("")}
              </div>
              <div>
                <div className="font-semibold text-default">{user.fullName}</div>
                <div className="text-sm text-secondary">Especialidad (demo)</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="secondary">Editar perfil</Button>
              <Button variant="secondary">Cambiar contraseña</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input id="fullName" defaultValue={user.fullName} />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={user.username} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="drrodriguez@sati.mx" />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" defaultValue="+52 55 0000 0002" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea id="bio" rows={4} defaultValue="Texto demo..." />
              </div>
            </div>

            <Button>Guardar cambios</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferencias de reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prefLoc">Ubicación preferida</Label>
              <Input id="prefLoc" defaultValue="Sede Roma" />
            </div>
            <div>
              <Label htmlFor="prefFeat">Características preferidas</Label>
              <Input id="prefFeat" defaultValue="Insonorizado, WiFi" />
            </div>
          </div>
          <Button variant="secondary">Guardar preferencias</Button>
        </CardContent>
      </Card>
    </div>
  );
};
