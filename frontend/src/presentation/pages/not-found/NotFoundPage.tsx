import React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "../../components/ui";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-lg w-full">
        <CardContent>
          <div className="text-center py-10">
            <div className="mx-auto mb-4 flex justify-center text-gray-500">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
            <p className="mt-2 text-gray-600">
              Did you forget to add the page to the router?
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
