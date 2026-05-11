import React from "react";
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
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="border border-default rounded-lg mb-3">
          <Disclosure.Button className="w-full px-4 py-3 text-left bg-surface-2 hover:bg-surface-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset flex justify-between items-center transition-colors">
            <span className="font-medium text-default text-sm md:text-base pr-4">
              {pregunta.pregunta}
            </span>
            <ChevronDown
              className={`${
                open ? "transform rotate-180" : ""
              } h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200`}
            />
          </Disclosure.Button>

          <Disclosure.Panel className="px-4 py-4 bg-surface text-secondary text-sm md:text-base whitespace-pre-line">
            {pregunta.respuesta}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};



