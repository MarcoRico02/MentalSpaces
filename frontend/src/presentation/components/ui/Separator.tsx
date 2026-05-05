import React from "react";

export const Separator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => {
  return <div className={`h-px w-full bg-surface-3 ${className}`} {...props} />;
};
