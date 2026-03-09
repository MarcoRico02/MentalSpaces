import React, { useState } from "react";
import { FileDown, FileText, Image as ImageIcon, User } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  Badge,
} from "../../components/ui";

type DocType = "ine" | "pasaporte" | "diploma" | "cedula";

type DocItem = {
  id: string;
  title: string;
  type: DocType;
  format: "PDF" | "JPG" | "PNG" | "DOC" | "DOCX";
  updatedAt: string;
  status: "Pendiente" | "Aprobado" | "Rechazado";
};

export const DocumentsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<DocItem | null>(null);

  const docs: DocItem[] = [
    {
      id: "doc-1",
      title: "Identificación Oficial (INE)",
      type: "ine",
      format: "JPG",
      updatedAt: "2026-02-01 09:12",
      status: "Aprobado",
    },
    {
      id: "doc-2",
      title: "Título Profesional (Diploma)",
      type: "diploma",
      format: "PDF",
      updatedAt: "2026-02-01 09:14",
      status: "Pendiente",
    },
  ];

  const statusVariant = (s: DocItem["status"]) => {
    if (s === "Aprobado") return "success";
    if (s === "Rechazado") return "danger";
    return "warning";
  };

  const openDoc = (d: DocItem) => {
    setActive(d);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Documentos"
        description="Visualiza y descarga tu documentación personal."
        right={
          <Button variant="secondary">
            <User className="h-4 w-4 mr-2" />
            Ir a Mi Perfil
          </Button>
        }
      />

      {docs.length === 0 ? (
        <EmptyState
          title="Aún no has subido documentos"
          description="Sube tu identificación oficial y tu título profesional desde Mi Perfil para completar tu registro."
          action={<Button>Ir a Mi Perfil</Button>}
          icon={<FileText className="h-10 w-10 text-muted-foreground" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((d) => (
            <Card key={d.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-3">
                  <span>{d.title}</span>
                  <Badge variant={statusVariant(d.status)}>{d.status}</Badge>
                </CardTitle>
                <p className="text-sm text-secondary mt-1">
                  Formato: {d.format} · Actualizado: {d.updatedAt}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-md bg-surface-2 flex items-center justify-center text-secondary">
                    {d.format === "PDF" ? (
                      <FileText className="h-6 w-6" />
                    ) : (
                      <ImageIcon className="h-6 w-6" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="text-sm text-secondary">
                      Vista previa (demo)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Detección automática de tipo de archivo
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => openDoc(d)}>
                      Ver
                    </Button>
                    <Button variant="secondary">
                      <FileDown className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={active?.title ?? "Documento"}
        description="Vista completa (maqueta)."
        maxWidthClassName="max-w-3xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
            <Button variant="secondary">
              <FileDown className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>
        }
      >
        <div className="rounded-md border border-dashed border-default bg-app p-8 text-center text-secondary">
          {active?.format === "PDF" ? (
            <div className="space-y-2">
              <FileText className="h-8 w-8 mx-auto" />
              <div className="font-medium">Visor de PDF embebido</div>
              <div className="text-sm">(simulado en UI)</div>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="h-8 w-8 mx-auto" />
              <div className="font-medium">Preview de imagen</div>
              <div className="text-sm">(simulado en UI)</div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};
