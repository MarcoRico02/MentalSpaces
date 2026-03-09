import React from "react";
import { Card, CardContent } from "../ui";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
}) => {
  return (
    <Card>
      <CardContent>
        <div className="text-center py-10">
          {icon && <div className="mx-auto mb-4 flex justify-center">{icon}</div>}
          <h3 className="text-lg font-semibold text-default">{title}</h3>
          {description && <p className="mt-2 text-secondary">{description}</p>}
          {action && <div className="mt-6 flex justify-center">{action}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
