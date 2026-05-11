import React from "react";
import { Card, CardContent } from "../ui";

interface CategoriaCardProps {
  nombre: string;
  descripcion?: string;
  icon: React.ComponentType<any>;
  preguntasCount: number;
  isActive?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

export const CategoriaCard: React.FC<CategoriaCardProps> = ({
  nombre,
  descripcion,
  icon: Icon,
  preguntasCount,
  isActive = true,
  onClick,
  isSelected = false,
}) => {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? "ring-2 ring-primary border-primary"
          : "hover:border-primary/50"
      } ${!isActive ? "opacity-50" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Icon */}
          <div
            className={`p-3 rounded-lg transition-colors ${
              isSelected ? "bg-primary/10" : "bg-surface-2"
            }`}
          >
            <Icon
              className={`h-6 w-6 transition-colors ${
                isSelected ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>

          {/* Nombre */}
          <h3 className="font-semibold text-default text-sm md:text-base line-clamp-2">
            {nombre}
          </h3>

          {/* Descripción opcional */}
          {descripcion && (
            <p className="text-xs text-secondary line-clamp-2">{descripcion}</p>
          )}

          {/* Badge de cantidad */}
          <div className="flex items-center justify-center px-2 py-1 bg-surface-2 rounded-full">
            <span className="text-xs font-medium text-secondary">
              {preguntasCount} {preguntasCount === 1 ? "pregunta" : "preguntas"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


