import React from "react";

type TableProps = React.TableHTMLAttributes<HTMLTableElement>;

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const Table: React.FC<TableProps> = ({ className = "", ...props }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={`w-full text-sm text-left text-default ${className}`}
        {...props}
      />
    </div>
  );
};

export const THead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <thead
      className={`text-xs uppercase bg-surface-2 text-muted-foreground ${className}`}
      {...props}
    />
  );
};

export const TBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = "",
  ...props
}) => {
  return <tbody className={`${className}`} {...props} />;
};

export const TR: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className = "",
  ...props
}) => {
  return <tr className={`border-b border-default ${className}`} {...props} />;
};

export const TH: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = "",
  ...props
}) => {
  return <th className={`px-4 py-3 font-semibold ${className}`} {...props} />;
};

export const TD: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = "",
  ...props
}) => {
  return <td className={`px-4 py-3 ${className}`} {...props} />;
};

export const TableToolbar: React.FC<DivProps> = ({
  className = "",
  ...props
}) => {
  return (
    <div
      className={`flex flex-col gap-3 md:flex-row md:items-end md:justify-between ${className}`}
      {...props}
    />
  );
};
