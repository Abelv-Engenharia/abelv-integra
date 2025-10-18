import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function TermoAltura() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Termo de Trabalho em Altura</h1>
          <p className="text-muted-foreground">
            Emissão de termos para trabalhos em altura (NR-35)
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Novo Termo
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
