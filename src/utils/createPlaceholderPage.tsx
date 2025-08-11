
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const createPlaceholderPage = (title: string, description?: string) => {
  return () => (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está em desenvolvimento. Funcionalidades serão implementadas em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
