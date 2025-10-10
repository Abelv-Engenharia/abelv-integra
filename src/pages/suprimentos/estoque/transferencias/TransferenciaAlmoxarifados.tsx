import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight } from "lucide-react";

const EstoqueTransferenciaAlmoxarifados = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transferência entre Almoxarifados</h1>
          <p className="text-muted-foreground">
            Transferência de materiais entre almoxarifados
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Transferência
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Transferências entre Almoxarifados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Página em construção - Transferência entre almoxarifados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueTransferenciaAlmoxarifados;
