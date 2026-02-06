import React from "react";
import { X } from "lucide-react";

export interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClassName?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  maxWidthClassName = "max-w-lg",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange?.(false)}
        aria-label="Cerrar modal"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`w-full ${maxWidthClassName} rounded-lg bg-white shadow-lg border border-gray-200`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-start justify-between gap-4 p-4 border-b border-gray-100">
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange?.(false)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">{children}</div>

          {footer && <div className="p-4 border-t border-gray-100">{footer}</div>}
        </div>
      </div>
    </div>
  );
};
