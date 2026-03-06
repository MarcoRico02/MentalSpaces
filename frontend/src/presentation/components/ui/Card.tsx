import React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<DivProps> = ({ className = "", ...props }) => {
  return (
    <div
      className={`bg-surface border border-default shadow-sm rounded-lg ${className}`}
      {...props}
    />
  );
};

export const CardHeader: React.FC<DivProps> = ({
  className = "",
  ...props
}) => {
  return <div className={`p-4 border-b border-default ${className}`} {...props} />;
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <h3
      className={`text-base font-semibold text-default leading-none ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className = "", ...props }) => {
  return <p className={`text-sm text-secondary mt-1 ${className}`} {...props} />;
};

export const CardContent: React.FC<DivProps> = ({
  className = "",
  ...props
}) => {
  return <div className={`p-4 ${className}`} {...props} />;
};

export const CardFooter: React.FC<DivProps> = ({
  className = "",
  ...props
}) => {
  return <div className={`p-4 border-t border-default ${className}`} {...props} />;
};
