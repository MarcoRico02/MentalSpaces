import React, { useState } from "react";
import { Calendar, CreditCard, Download, Plus } from "lucide-react";
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
  Select,
  Table,
  TBody,
  TD,
  THead,
  TH,
  TR,
  Tabs,
} from "../../components/ui";

export const PaymentsPage: React.FC = () => {
  const [tab, setTab] = useState("pending");
  const [stripeOpen, setStripeOpen] = useState(false);

  const pending = Array.from({ length: 3 }).map((_, i) => ({
    concept: "Reserva asociada",
    amount: "$450.00",
    due: "2026-02-10",
    booking: `BK-${200 + i}`,
  }));

  const history = Array.from({ length: 6 }).map((_, i) => {
    const st = ["Exitoso", "Fallido", "Reembolsado"][i % 3];
    return {
      date: "2026-02-03",
      concept: "Pago de reserva",
      amount: "$450.00",
      method: ["Stripe", "Transferencia"][i % 2],
      status: st,
    };
  });

  const badgeVariant = (s: string) => {
    if (s === "Exitoso") return "success";
    if (s === "Fallido") return "danger";
    return "info";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagos"
        description="Vista de usuario (maqueta). En /admin/payments se muestra la vista admin."
      />

      <Tabs
        value={tab}
        onValueChange={setTab}
        options={[
          { value: "pending", label: "Pendientes" },
          { value: "plan", label: "Mi suscripción" },
          { value: "history", label: "Historial" },
        ]}
      />

      {tab === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Mis pagos pendientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pending.map((p) => (
              <div
                key={p.booking}
                className="rounded-md border border-default p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <div className="font-medium text-default">{p.concept}</div>
                  <div className="text-sm text-secondary">
                    Vence: {p.due} · Reserva: {p.booking}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-default">{p.amount}</div>
                  <Button onClick={() => setStripeOpen(true)}>Pagar</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "plan" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mi plan actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xl font-bold text-default">Plan Pro</div>
                  <div className="text-sm text-secondary">$1,299 / mes</div>
                </div>
                <Badge variant="success">Activo</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-app p-3">
                  <div className="text-secondary">Horas incluidas</div>
                  <div className="font-semibold text-default">10</div>
                </div>
                <div className="rounded-md bg-app p-3">
                  <div className="text-secondary">Horas restantes</div>
                  <div className="font-semibold text-default">4</div>
                </div>
                <div className="rounded-md bg-app p-3 col-span-2">
                  <div className="text-secondary">Renovación</div>
                  <div className="font-semibold text-default">2026-03-01</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary">Cambiar plan</Button>
                <Button variant="danger">Cancelar</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planes disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Básico", price: "$699", hours: "4" },
                { name: "Pro", price: "$1,299", hours: "10" },
                { name: "Ilimitado", price: "$2,499", hours: "∞" },
              ].map((pl) => (
                <div
                  key={pl.name}
                  className="rounded-md border border-default p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-default">{pl.name}</div>
                    <div className="text-sm text-secondary">
                      {pl.price} / mes · {pl.hours} horas
                    </div>
                  </div>
                  <Button variant="secondary">Seleccionar</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de pagos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Estado</div>
                <Select defaultValue="all">
                  <option value="all">Todos</option>
                  <option value="success">Exitoso</option>
                  <option value="failed">Fallido</option>
                  <option value="refunded">Reembolsado</option>
                </Select>
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Desde</div>
                <Input type="date" />
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Hasta</div>
                <Input type="date" />
              </div>
              <div className="flex items-end">
                <Button variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <Table>
              <THead>
                <TR>
                  <TH>Fecha</TH>
                  <TH>Concepto</TH>
                  <TH>Monto</TH>
                  <TH>Método</TH>
                  <TH>Estado</TH>
                  <TH>Acciones</TH>
                </TR>
              </THead>
              <TBody>
                {history.map((h, idx) => (
                  <TR key={idx}>
                    <TD>{h.date}</TD>
                    <TD>{h.concept}</TD>
                    <TD className="font-semibold text-default">{h.amount}</TD>
                    <TD>{h.method}</TD>
                    <TD>
                      <Badge variant={badgeVariant(h.status)}>{h.status}</Badge>
                    </TD>
                    <TD>
                      <Button variant="secondary" className="px-3 py-1.5">
                        Ver recibo
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={stripeOpen}
        onOpenChange={setStripeOpen}
        title="Pago con tarjeta"
        description="Maqueta del formulario de Stripe (solo UI)."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setStripeOpen(false)}>
              Cerrar
            </Button>
            <Button>Confirmar</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-md border border-dashed border-default p-4 text-sm text-secondary">
            PaymentForm reutilizable (Stripe Elements) iría aquí.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-secondary mb-1">Nombre</div>
              <Input placeholder="Nombre Apellido" />
            </div>
            <div>
              <div className="text-sm font-medium text-secondary mb-1">Código postal</div>
              <Input placeholder="00000" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Calendar className="h-4 w-4" />
            Manejo de 3D Secure / webhooks (mencionado en specs).
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export const AdminPaymentsPage: React.FC = () => {
  const [tab, setTab] = useState("dashboard");
  const [detailOpen, setDetailOpen] = useState(false);

  const stats = [
    { label: "Total del mes", value: "$124,900" },
    { label: "Pendientes", value: "$8,200" },
    { label: "Fallidos", value: "$1,050" },
    { label: "Tasa de éxito", value: "93%" },
  ];

  const rows = Array.from({ length: 8 }).map((_, i) => {
    const st = ["Exitoso", "Fallido", "Pendiente"][i % 3];
    return {
      id: 9000 + i,
      date: "2026-02-03",
      user: "Usuario Demo (user@sati.mx)",
      concept: "Pago de reserva",
      amount: "$450.00",
      method: ["Stripe", "Transferencia"][i % 2],
      status: st,
    };
  });

  const badgeVariant = (s: string) => {
    if (s === "Exitoso") return "success";
    if (s === "Fallido") return "danger";
    return "warning";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagos (Admin)"
        description="Panel administrativo financiero (maqueta)."
        right={
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        }
      />

      <Tabs
        value={tab}
        onValueChange={setTab}
        options={[
          { value: "dashboard", label: "Dashboard" },
          { value: "plans", label: "Planes" },
          { value: "manual", label: "Pago manual" },
          { value: "history", label: "Historial" },
          { value: "subs", label: "Suscripciones" },
        ]}
      />

      {tab === "dashboard" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-secondary">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-default">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "plans" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Planes de suscripción</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <THead>
                  <TR>
                    <TH>Nombre</TH>
                    <TH>Precio</TH>
                    <TH>Horas</TH>
                    <TH>Cancelaciones</TH>
                    <TH>Acciones</TH>
                  </TR>
                </THead>
                <TBody>
                  {[
                    { name: "Básico", price: 699, hours: 4, allow: true },
                    { name: "Pro", price: 1299, hours: 10, allow: true },
                    { name: "Ilimitado", price: 2499, hours: 0, allow: false },
                  ].map((p) => (
                    <TR key={p.name}>
                      <TD className="font-medium text-default">{p.name}</TD>
                      <TD>${p.price}</TD>
                      <TD>{p.hours === 0 ? "Ilimitado" : p.hours}</TD>
                      <TD>
                        <Badge variant={p.allow ? "success" : "warning"}>
                          {p.allow ? "Sí" : "No"}
                        </Badge>
                      </TD>
                      <TD>
                        <div className="flex gap-2">
                          <Button variant="secondary" className="px-3 py-1.5">
                            Editar
                          </Button>
                          <Button variant="danger" className="px-3 py-1.5">
                            Eliminar
                          </Button>
                        </div>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Crear/Editar plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Nombre</div>
                <Input placeholder="Nombre del plan" />
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Precio</div>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Horas</div>
                <Input type="number" placeholder="0 = ilimitado" />
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">
                  Permite cancelaciones
                </div>
                <Select defaultValue="yes">
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </Select>
              </div>
              <Button className="w-full">Guardar</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "manual" && (
        <Card>
          <CardHeader>
            <CardTitle>Registro manual de pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Usuario</div>
                <Select defaultValue="">
                  <option value="" disabled>
                    Selecciona usuario
                  </option>
                  <option>Usuario Demo</option>
                  <option>Otro Usuario</option>
                </Select>
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Monto</div>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Fecha</div>
                <Input type="date" />
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Método</div>
                <Select defaultValue="cash">
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia</option>
                  <option value="other">Otro</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm font-medium text-secondary mb-1">
                  Referencia/Comprobante
                </div>
                <Input placeholder="Folio, referencia, etc." />
              </div>
              <div className="md:col-span-3">
                <div className="text-sm font-medium text-secondary mb-1">Concepto</div>
                <Input placeholder="Descripción" />
              </div>
            </div>
            <div className="mt-4">
              <Button>Guardar pago</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle>Historial completo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Usuario</div>
                <Input placeholder="ID o nombre" />
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Estado</div>
                <Select defaultValue="all">
                  <option value="all">Todos</option>
                  <option value="success">Exitoso</option>
                  <option value="failed">Fallido</option>
                  <option value="pending">Pendiente</option>
                </Select>
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Método</div>
                <Select defaultValue="all">
                  <option value="all">Todos</option>
                  <option value="stripe">Stripe</option>
                  <option value="transfer">Transferencia</option>
                  <option value="cash">Efectivo</option>
                </Select>
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Desde</div>
                <Input type="date" />
              </div>
              <div>
                <div className="text-sm font-medium text-secondary mb-1">Hasta</div>
                <Input type="date" />
              </div>
            </div>

            <Table>
              <THead>
                <TR>
                  <TH>ID</TH>
                  <TH>Fecha</TH>
                  <TH>Usuario</TH>
                  <TH>Concepto</TH>
                  <TH>Monto</TH>
                  <TH>Método</TH>
                  <TH>Estado</TH>
                  <TH>Acciones</TH>
                </TR>
              </THead>
              <TBody>
                {rows.map((r) => (
                  <TR key={r.id}>
                    <TD className="font-medium text-default">{r.id}</TD>
                    <TD>{r.date}</TD>
                    <TD>{r.user}</TD>
                    <TD>{r.concept}</TD>
                    <TD className="font-semibold text-default">{r.amount}</TD>
                    <TD>{r.method}</TD>
                    <TD>
                      <Badge variant={badgeVariant(r.status)}>{r.status}</Badge>
                    </TD>
                    <TD>
                      <Button
                        variant="secondary"
                        className="px-3 py-1.5"
                        onClick={() => setDetailOpen(true)}
                      >
                        Ver detalle
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === "subs" && (
        <Card>
          <CardHeader>
            <CardTitle>Suscripciones activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-md border border-default p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <div className="font-medium text-default">
                      Usuario Demo {i + 1} · Plan Pro
                    </div>
                    <div className="text-sm text-secondary">
                      Inicio: 2026-01-01 · Próxima renovación: 2026-03-01
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Activo</Badge>
                    <Button variant="secondary" className="px-3 py-1.5">
                      Cambiar plan
                    </Button>
                    <Button variant="danger" className="px-3 py-1.5">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Detalle de pago"
        description="Modal de detalle (maqueta)."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDetailOpen(false)}>
              Cerrar
            </Button>
            <Button variant="danger">Reembolsar</Button>
          </div>
        }
        maxWidthClassName="max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-md border border-default p-3">
            <div className="text-secondary">Stripe PaymentIntent</div>
            <div className="font-medium text-default">pi_1234567890</div>
          </div>
          <div className="rounded-md border border-default p-3">
            <div className="text-secondary">Moneda</div>
            <div className="font-medium text-default">MXN</div>
          </div>
          <div className="md:col-span-2 rounded-md border border-default p-3">
            <div className="text-secondary">Historial de intentos</div>
            <div className="font-medium text-default">
              Intento #1: ok · Intento #2: ok
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
