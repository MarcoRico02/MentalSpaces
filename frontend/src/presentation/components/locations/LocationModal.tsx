import React from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { LocationForm } from "./LocationForm";
import type { LocationResponseDTO } from "../../../core/dominio/tipos/api";
import type { LocationCreateFormData } from "../../../core/dominio/tipos/schemas";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: LocationResponseDTO;
  onSubmit: (data: LocationCreateFormData) => void;
  isLoading?: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  location,
  onSubmit,
  isLoading = false,
}) => {
  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 transition-opacity backdrop-blur-[2px]" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all">
          {/* Header */}
          <div className="sticky top-0 bg-surface border-b border-default px-6 py-4 z-10">
            <DialogTitle className="text-xl font-semibold text-default">
              {location ? "Editar Locación" : "Nueva Locación"}
            </DialogTitle>
          </div>

          {/* Form Content */}
          <div className="px-6 py-6 max-h-[calc(90vh-80px)] overflow-y-auto">
            <LocationForm
              location={location}
              onSubmit={onSubmit}
              isLoading={isLoading}
              onCancel={handleCancel}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
