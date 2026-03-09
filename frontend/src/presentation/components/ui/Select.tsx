import React from "react";

export const Select: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }
> = ({ error, className = "", children, ...props }) => {
  return (
    <div>
      <select
        className={`w-full px-3 py-2 border rounded-md bg-surface text-default focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? "border-red-500" : "border-default"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
