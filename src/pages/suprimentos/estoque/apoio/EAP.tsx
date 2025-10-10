import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const EstoqueEAP = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EAP</h1>
          <p className="text-muted-foreground">
            Estrutura Analítica do Projeto
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Nó EAP
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de EAP</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Página em construção - Estrutura Analítica do Projeto
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueEAP;
