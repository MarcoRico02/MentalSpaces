import React, { useId } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import type { PreguntaFAQDTO } from "../../../core/dominio/tipos/api";

interface PreguntaItemProps {
  pregunta: PreguntaFAQDTO;
  defaultOpen?: boolean;
}

export const PreguntaItem: React.FC<PreguntaItemProps> = ({
  pregunta,
  defaultOpen = false,
}) => {
  // Generar IDs únicos para accesibilidad (aria-controls, aria-labelled-by)
  const buttonId = useId();
  const panelId = useId();

  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="border border-default rounded-lg mb-3 overflow-hidden">
          {/* Botón de pregunta - Headless UI Disclosure.Button */}
          <Disclosure.Button
            id={buttonId}
            aria-expanded={open}
            aria-controls={panelId}
            className="w-full px-4 py-3 text-left bg-surface-2 hover:bg-surface-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset flex justify-between items-center transition-colors duration-150 cursor-pointer group"
          >
            {/* Pregunta */}
            <span className="font-medium text-default text-sm md:text-base pr-4 group-hover:text-primary transition-colors duration-150">
              {pregunta.pregunta}
            </span>

            {/* Chevron rotativo - Animación suave con rotate-180 */}
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-in-out ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </Disclosure.Button>

          {/* Panel de respuesta - Headless UI Disclosure.Panel con animación */}
          <Disclosure.Panel
            id={panelId}
            className="px-4 py-4 bg-surface text-secondary text-sm md:text-base whitespace-pre-line overflow-hidden transition-all duration-300 ease-in-out"
            role="region"
            aria-labelledby={buttonId}
          >
            {/* Contenedor para animar la altura */}
            <div className="animate-fadeIn">
              {pregunta.respuesta}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};



