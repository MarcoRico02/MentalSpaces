import React from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <DialogPanel
          className={`relative bg-surface rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all border border-default`}
        >
          {title && (
            <DialogTitle className="px-6 py-4 border-b border-default text-lg font-semibold text-default">
              {title}
            </DialogTitle>
          )}

          <div className={`${title ? "px-6 py-4" : "p-6"} max-h-[75vh] overflow-y-auto`}>{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning",
}) => {
  const typeClasses = {
    danger: {
      confirm: "bg-red-600 hover:bg-red-700 text-white",
      icon: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    warning: {
      confirm: "bg-yellow-600 hover:bg-yellow-700 text-white",
      icon: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    info: {
      confirm: "bg-primary text-white hover:opacity-90",
      icon: "text-primary",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
  };

  const classes = typeClasses[type];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${classes.bg} mb-4`}>
          <svg className={`h-6 w-6 ${classes.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h3 className="text-lg font-medium text-default mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>

        <div className="flex space-x-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-default bg-surface border border-default rounded-md hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${classes.confirm}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
