import React, { useState } from "react";
import { BellRing, Clock, CreditCard, Mail, User } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Switch,
  Tabs,
} from "../../components/ui";

export const SettingsPage: React.FC = () => {
  const [tab, setTab] = useState("account");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración"
        description="Preferencias de cuenta y plataforma (demo/placeholder)."
      />

      <Tabs
        value={tab}
        onValueChange={setTab}
        options={[
          { value: "account", label: "Cuenta" },
          { value: "notifications", label: "Notificaciones" },
          { value: "billing", label: "Facturación" },
        ]}
      />

      {tab === "account" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                  RM
                </div>
                <Button variant="secondary">Cambiar foto</Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input id="fullName" defaultValue="Rodrigo Martínez" />
                </div>
                <div>
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input id="username" defaultValue="rodrigomtz" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="user@sati.mx" />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" defaultValue="+52 55 0000 0000" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Input id="specialty" defaultValue="Psicología clínica" />
                </div>
              </div>

              <Button className="w-full sm:w-auto">Guardar cambios</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información profesional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="license">Cédula profesional</Label>
                  <Input id="license" defaultValue="ABC-123456" />
                </div>
                <div>
                  <Label htmlFor="clinic">Clínica / Organización</Label>
                  <Input id="clinic" defaultValue="SATI Centro" />
                </div>
              </div>
              <Button variant="secondary" className="w-full sm:w-auto">
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                Notificaciones por email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-gray-900">Nuevas reservas</div>
                  <div className="text-sm text-gray-600">
                    Recibe un correo cuando se cree una reserva.
                  </div>
                </div>
                <Switch checked />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-gray-900">Cancelaciones</div>
                  <div className="text-sm text-gray-600">
                    Aviso cuando una reserva sea cancelada.
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-gray-900">Recordatorios</div>
                  <div className="text-sm text-gray-600">
                    Recordatorio previo al inicio de la reserva.
                  </div>
                </div>
                <Switch checked />
              </div>
              <Button className="w-full sm:w-auto">Guardar cambios</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recordatorios del sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reminder">Tiempo de recordatorio (horas)</Label>
                <Input id="reminder" type="number" defaultValue={24} />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                Se enviará un correo según el tiempo configurado.
              </div>
              <Button variant="secondary" className="w-full sm:w-auto">
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "billing" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Método de pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-gray-200 p-4">
                <div className="text-sm text-gray-600">Tarjeta guardada</div>
                <div className="font-medium text-gray-900">Visa •••• 4242</div>
                <div className="text-sm text-gray-600">Expira 12/27</div>
              </div>
              <Button variant="secondary">Editar</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de facturación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                Sección demo para futuras facturas.
              </div>
              <Button>Enviar por correo</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
