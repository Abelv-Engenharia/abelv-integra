import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const LogsImportacaoDesvios = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Histórico de Importações
        </CardTitle>
        <CardDescription>
          Registros de importações de desvios realizadas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Funcionalidade de logs em desenvolvimento</p>
        </div>
      </CardContent>
    </Card>
  );
};
