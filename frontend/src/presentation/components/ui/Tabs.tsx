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
    <div className={`inline-flex rounded-md border border-default bg-surface p-1 ${className}`}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onValueChange?.(opt.value)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              active
                ? "bg-primary text-white"
                : "text-default hover:bg-surface-2"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
