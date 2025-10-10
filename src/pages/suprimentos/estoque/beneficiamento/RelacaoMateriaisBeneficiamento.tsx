import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const EstoqueRelacaoMateriaisBeneficiamento = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relação de Materiais em Beneficiamento</h1>
          <p className="text-muted-foreground">
            Lista de materiais atualmente em processo de beneficiamento
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materiais em Beneficiamento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhum material em beneficiamento no momento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueRelacaoMateriaisBeneficiamento;
