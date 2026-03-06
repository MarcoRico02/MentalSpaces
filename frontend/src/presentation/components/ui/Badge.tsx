import React from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const variants: Record<BadgeVariant, string> = {
    default:  "bg-surface-2 text-default",
    success:  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    warning:  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    danger:   "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    info:     "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    outline:  "border border-default text-default bg-transparent",
  };

  return <span className={`${base} ${variants[variant]} ${className}`} {...props} />;
};
