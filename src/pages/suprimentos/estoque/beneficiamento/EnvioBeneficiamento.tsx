import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";

const EstoqueEnvioBeneficiamento = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Envio para Beneficiamento</h1>
          <p className="text-muted-foreground">
            Registro de materiais enviados para beneficiamento
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Envio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Envios para Beneficiamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Página em construção - Envio para beneficiamento
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueEnvioBeneficiamento;
