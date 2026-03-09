import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  right?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  right,
}) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-default">{title}</h1>
        {description && <p className="mt-1 text-secondary">{description}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
};
