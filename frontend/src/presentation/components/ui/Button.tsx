import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    // Azul — usa --primary que cambia según el tema (blue-600 claro / blue-400 oscuro)
    primary:
      "bg-primary text-white hover:opacity-90 focus:ring-primary",
    // Secundario — superficie neutra con texto claro en oscuro
    secondary:
      "bg-surface-2 text-default border border-default hover:bg-surface-3 focus:ring-primary",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && "Cargando..."}
      {children}
    </button>
  );
};
