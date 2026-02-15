import React from "react";

export type TabsOption = { value: string; label: string };

interface TabsProps {
  value: string;
  onValueChange?: (value: string) => void;
  options: TabsOption[];
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  options,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex rounded-md border border-gray-200 bg-white p-1 ${className}`}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onValueChange?.(opt.value)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              active
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
