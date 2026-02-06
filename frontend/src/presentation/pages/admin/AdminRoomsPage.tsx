import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
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
  Tabs,
} from "../../components/ui";

export const AdminRoomsPage: React.FC = () => {
  const [tab, setTab] = useState("rooms");
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  const rooms = Array.from({ length: 6 }).map((_, i) => ({
    id: `RM-${i + 1}`,
    name: `Consultorio ${i + 1}`,
    location: i % 2 === 0 ? "Sede Roma" : "Sede Condesa",
    price: 450 + i * 10,
    active: i % 5 !== 0,
    features: ["WiFi", "Aire acondicionado", "Insonorizado"].slice(0, 1 + (i % 3)),
  }));

  const locations = [
    { id: 1, name: "Sede Roma" },
    { id: 2, name: "Sede Condesa" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Salas y Ubicaciones"
        description="Panel admin (maqueta)."
      />

      <Tabs
        value={tab}
        onValueChange={setTab}
        options={[
          { value: "rooms", label: "Salas" },
          { value: "locations", label: "Ubicaciones" },
          { value: "calendar", label: "Calendario" },
        ]}
      />

      {tab === "rooms" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <span>Gestión de salas</span>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar..."
                    className="pl-9"
                  />
                </div>
                <Button onClick={() => setEditOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar sala
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rooms
              .filter((r) =>
                search
                  ? `${r.name} ${r.location} ${r.id}`
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  : true,
              )
              .map((r) => (
                <div
                  key={r.id}
                  className="rounded-md border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {r.name} <span className="text-xs text-gray-500">({r.id})</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {r.location} · ${r.price}/hora
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {r.features.map((f) => (
                        <Badge key={f} variant="outline">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.active ? "success" : "outline"}>
                      {r.active ? "Activo" : "Inactivo"}
                    </Badge>
                    <Button variant="secondary" onClick={() => setEditOpen(true)}>
                      Editar
                    </Button>
                    <Button variant="danger">Eliminar</Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {tab === "locations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((l) => (
            <Card key={l.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{l.name}</span>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="px-3 py-1.5">
                      Editar
                    </Button>
                    <Button variant="danger" className="px-3 py-1.5">
                      Eliminar
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Dirección, descripción, imagen URL, coordenadas (maqueta).
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "calendar" && (
        <Card>
          <CardHeader>
            <CardTitle>Calendario por rango</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <Label htmlFor="start">Fecha inicio</Label>
                <Input id="start" type="date" />
              </div>
              <div>
                <Label htmlFor="end">Fecha fin</Label>
                <Input id="end" type="date" />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select id="status" defaultValue="all">
                  <option value="all">Todos</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="secondary" className="w-full">
                  Aplicar
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
              Vista de reservas por rango + popover de detalles (maqueta).
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Crear/Editar sala"
        description="Modal de edición (maqueta)."
        maxWidthClassName="max-w-2xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button>Guardar</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Consultorio X" />
          </div>
          <div>
            <Label htmlFor="loc">Ubicación</Label>
            <Select id="loc" defaultValue="roma">
              <option value="roma">Sede Roma</option>
              <option value="condesa">Sede Condesa</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Precio por hora</Label>
            <Input id="price" type="number" placeholder="0" />
          </div>
          <div>
            <Label htmlFor="image">Imagen URL</Label>
            <Input id="image" placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="features">Características</Label>
            <Input id="features" placeholder="Escribe y agrega (maqueta)" />
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                "Insonorizado",
                "Con ventana",
                "Aire acondicionado",
                "WiFi",
              ].map((f) => (
                <Badge key={f} variant="outline">
                  {f}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
