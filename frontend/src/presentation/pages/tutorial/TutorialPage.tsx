import React, { useMemo, useState } from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../components/ui";

type Section = {
  title: string;
  body: string;
  primaryLabel: string;
};

export const TutorialPage: React.FC = () => {
  const sections = useMemo<Section[]>(
    () => [
      {
        title: "Bienvenido a SATI Centro de Consulta",
        body:
          "Documentos requeridos:\n- Identificación oficial (INE/Pasaporte)\n- Título profesional (Diploma/Cédula)\n\nLa validación la realiza un administrador.",
        primaryLabel: "Siguiente",
      },
      {
        title: "Realiza una reserva",
        body:
          "Proceso paso a paso:\n1) Selecciona centro\n2) Elige sala\n3) Selecciona fecha y hora\n4) Confirma\n\nRecibirás confirmación por email.\nRecuerda dejar el cubículo limpio.\nPenalizaciones por incumplimiento (según reglas).",
        primaryLabel: "Siguiente",
      },
      {
        title: "Navegación por la plataforma",
        body:
          "Usa la barra lateral para acceder a:\n- Mi perfil\n- Pagos\n- Estado de cuenta\n- Preguntas frecuentes\n\n¡Listo!",
        primaryLabel: "Comenzar",
      },
    ],
    [],
  );

  const [step, setStep] = useState(0);
  const current = sections[step];

  return (
    <div className="space-y-6">
      <PageHeader title="Tutorial" description="Onboarding tipo wizard (maqueta)." />

      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>{current.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-secondary whitespace-pre-line">{current.body}</div>

            <div className="flex items-center justify-center gap-2">
              {sections.map((_, idx) => {
                const active = idx === step;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setStep(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      active ? "bg-primary" : "bg-surface-3 hover:bg-muted-foreground"
                    }`}
                    aria-label={`Ir al paso ${idx + 1}`}
                  />
                );
              })}
            </div>

            <div className="flex justify-between">
              <Button
                variant="secondary"
                disabled={step === 0}
                className={step === 0 ? "opacity-50" : ""}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Anterior
              </Button>

              <Button
                onClick={() => {
                  if (step < sections.length - 1) setStep((s) => s + 1);
                  // En el último paso, redirigiría a / (maqueta)
                }}
              >
                {current.primaryLabel}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Guardar “tutorial completado” en storage/DB (mencionado) - demo.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
