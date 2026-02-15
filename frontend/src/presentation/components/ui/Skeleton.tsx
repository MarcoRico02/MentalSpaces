import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  lines,
  ...props
}) => {
  if (lines && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 w-full animate-pulse rounded bg-gray-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`h-4 w-full animate-pulse rounded bg-gray-200 ${className}`}
      {...props}
    />
  );
};
