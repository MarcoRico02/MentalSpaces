import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  resultsCount?: number | null;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Buscar preguntas...",
  disabled = false,
  resultsCount,
}) => {
  const hasValue = value.trim().length > 0;

  return (
    <div className="space-y-2">
      <div className="relative">
        {/* Icono de búsqueda */}
        <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-3.5 pointer-events-none" />

        {/* Input de búsqueda */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-9 pr-9"
          type="text"
        />

        {/* Botón limpiar (visible solo cuando hay texto) */}
        {hasValue && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-surface-2 rounded"
            title="Limpiar búsqueda"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Resultado de búsqueda (contador) */}
      {hasValue && resultsCount !== null && (
        <div className="text-xs text-secondary px-1">
          {resultsCount === 0
            ? "No se encontraron resultados"
            : `${resultsCount} ${resultsCount === 1 ? "resultado" : "resultados"} encontrado${resultsCount === 1 ? "" : "s"}`}
        </div>
      )}
    </div>
  );
};


