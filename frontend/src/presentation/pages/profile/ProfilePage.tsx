import React, { useState } from "react";
import { Image as ImageIcon, Lock, Palette, Upload } from "lucide-react";
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
  Label,
  Select,
  Switch,
  Tabs,
  Textarea,
} from "../../components/ui";

export const ProfilePage: React.FC = () => {
  const [tab, setTab] = useState("info");
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Perfil"
        description="Gestiona tu información, seguridad, documentos y apariencia (maqueta)."
      />

      <Tabs
        value={tab}
        onValueChange={setTab}
        options={[
          { value: "info", label: "Información" },
          { value: "security", label: "Seguridad" },
          { value: "documents", label: "Documentos" },
          { value: "appearance", label: "Apariencia" },
        ]}
      />

      {tab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input id="fullName" defaultValue="Rodrigo Martínez" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="user@sati.mx" />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" defaultValue="+52 55 0000 0000" />
                </div>
                <div>
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Input id="specialty" defaultValue="Psicología clínica" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea id="bio" rows={4} defaultValue="Breve descripción..." />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="professionalType">Tipo profesional</Label>
                  <Select id="professionalType" defaultValue="psicologo">
                    <option value="psicologo">Psicólogo</option>
                    <option value="psiquiatra">Psiquiatra</option>
                    <option value="terapeuta">Terapeuta</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="license">Cédula profesional</Label>
                  <Input id="license" defaultValue="ABC-123456" />
                </div>
              </div>

              <Button>Guardar</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imagen de perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-gray-200 p-4 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="avatar">URL</Label>
                  <Input id="avatar" placeholder="https://..." />
                </div>
                <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
                  Preview
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                Posibilidad de actualizar y previsualizar (maqueta).
              </div>

              <Button variant="secondary">Actualizar imagen</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "security" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current">Contraseña actual</Label>
                <Input id="current" type="password" />
              </div>
              <div>
                <Label htmlFor="new">Nueva contraseña</Label>
                <Input id="new" type="password" />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Validación de seguridad, bcrypt, tokens (mencionado) - solo UI.
            </div>
            <Button>Cambiar contraseña</Button>
          </CardContent>
        </Card>
      )}

      {tab === "documents" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Subir documentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ident">Identificación oficial (INE/Pasaporte)</Label>
                <Input id="ident" type="file" />
              </div>
              <div>
                <Label htmlFor="diploma">Título profesional (Diploma/Cédula)</Label>
                <Input id="diploma" type="file" />
              </div>
              <div className="text-sm text-gray-600">
                Formatos permitidos: JPG, PNG, PDF, DOC, DOCX · Máx 5MB (maqueta).
              </div>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Subir
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de validación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                <div>
                  <div className="font-medium text-gray-900">Identificación</div>
                  <div className="text-sm text-gray-600">Última actualización: 2026-02-01</div>
                </div>
                <Badge variant="success">Aprobado</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                <div>
                  <div className="font-medium text-gray-900">Título profesional</div>
                  <div className="text-sm text-gray-600">Última actualización: 2026-02-01</div>
                </div>
                <Badge variant="warning">Pendiente</Badge>
              </div>
              <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
                Ver previsualización
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "appearance" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-md border border-gray-200 p-4">
              <div>
                <div className="font-medium text-gray-900">Modo oscuro</div>
                <div className="text-sm text-gray-600">Persistencia localStorage (maqueta)</div>
              </div>
              <Switch />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preset">Color primario (preset)</Label>
                <Select id="preset" defaultValue="green">
                  <option value="green">Verde (default)</option>
                  <option value="blue">Azul</option>
                  <option value="purple">Morado</option>
                  <option value="pink">Rosa</option>
                  <option value="orange">Naranja</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="hex">HEX personalizado</Label>
                <Input id="hex" placeholder="#22c55e" />
                <div className="text-xs text-gray-500 mt-1">
                  Validación formato HEX + preview en tiempo real (maqueta)
                </div>
              </div>
            </div>

            <Button>Guardar apariencia</Button>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title="Preview"
        description="Modal de vista completa (maqueta)."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setPreviewOpen(false)}>
              Cerrar
            </Button>
            <Button variant="secondary">Descargar</Button>
          </div>
        }
        maxWidthClassName="max-w-3xl"
      >
        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
          Preview de imagen/PDF embebido (maqueta).
        </div>
      </Dialog>
    </div>
  );
};
