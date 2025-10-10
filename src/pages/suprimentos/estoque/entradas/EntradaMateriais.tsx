import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

const EstoqueEntradaMateriais = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Entrada de Materiais</h1>
          <p className="text-muted-foreground">
            Registro de entradas de materiais no estoque
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Entrada
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Entradas de Materiais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Página em construção - Entrada de materiais
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueEntradaMateriais;
