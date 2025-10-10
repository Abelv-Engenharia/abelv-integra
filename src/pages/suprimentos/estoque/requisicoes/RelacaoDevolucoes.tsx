import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function RelacaoDevolucoes() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relação de Devoluções</h1>
          <p className="text-muted-foreground">
            Listagem de todas as devoluções de materiais
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parâmetros do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Selecione os parâmetros para gerar a relação de devoluções.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
