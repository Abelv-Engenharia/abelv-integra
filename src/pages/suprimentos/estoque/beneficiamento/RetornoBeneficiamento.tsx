import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";

const EstoqueRetornoBeneficiamento = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Retorno de Beneficiamento</h1>
          <p className="text-muted-foreground">
            Registro de materiais retornados de beneficiamento
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Retorno
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Retornos de Beneficiamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Página em construção - Retorno de beneficiamento
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueRetornoBeneficiamento;
