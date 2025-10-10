import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const EstoqueRelacaoMateriaisBeneficiamento = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relação de Materiais em Beneficiamento</h1>
          <p className="text-muted-foreground">
            Lista de materiais atualmente em beneficiamento
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Materiais em Beneficiamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Página em construção - Relação de materiais em beneficiamento
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueRelacaoMateriaisBeneficiamento;
