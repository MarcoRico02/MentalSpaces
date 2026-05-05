import React from "react";

export const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
> = ({ error, className = "", ...props }) => {
  return (
    <div>
      <input
        className={`w-full px-3 py-2 border rounded-md bg-surface text-default placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? "border-red-500" : "border-default"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <label
      className={`block text-sm font-medium text-default mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};
