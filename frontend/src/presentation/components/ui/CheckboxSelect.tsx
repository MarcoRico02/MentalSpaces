import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Check } from "lucide-react";

interface CheckboxSelectOption<T extends string | number> {
  value: T;
  label: string;
}

interface CheckboxSelectProps<T extends string | number> {
  label: string;
  options: CheckboxSelectOption<T>[];
  selected: T[];
  onChange: (values: T[]) => void;
  error?: string;
  className?: string;
  panelClassName?: string;
}

export function CheckboxSelect<T extends string | number>({
  label,
  options,
  selected,
  onChange,
  error,
  className = "",
  panelClassName = "",
}: CheckboxSelectProps<T>) {
  return (
    <div className={`relative ${className}`}>
      <Listbox value={selected} onChange={onChange} multiple>
        <ListboxButton
          className={`w-full px-3 py-2 text-left border rounded-md bg-surface text-default focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            error ? "border-red-500" : "border-default"
          }`}
        >
          {selected.length === 0 ? (
            <span className="text-secondary">{label}</span>
          ) : (
            <span>{`${selected.length} seleccionado${selected.length !== 1 ? "s" : ""}`}</span>
          )}
        </ListboxButton>
        <ListboxOptions anchor="bottom" className={`z-50 border border-default rounded-md bg-surface shadow-lg max-h-60 overflow-y-auto ${panelClassName}`}>
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            return (
              <ListboxOption
                key={opt.value}
                value={opt.value}
                className="group flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary/10 data-[focus]:bg-primary/10"
              >
                <div
                  className={`flex items-center justify-center w-4 h-4 shrink-0 rounded border transition-colors ${
                    isSelected
                      ? "bg-primary border-primary text-white"
                      : "border-default"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                </div>
                <span className="text-sm text-default truncate">{opt.label}</span>
              </ListboxOption>
            );
          })}
        </ListboxOptions>
      </Listbox>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
