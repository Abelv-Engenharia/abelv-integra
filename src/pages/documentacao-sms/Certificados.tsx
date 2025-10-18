import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function Certificados() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certificados de Treinamento</h1>
          <p className="text-muted-foreground">
            Emissão de certificados para treinamentos realizados
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Novo Certificado
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulário em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta funcionalidade está em desenvolvimento e em breve estará disponível.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
