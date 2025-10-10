import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Undo2 } from "lucide-react";

const EstoqueDevolucaoMateriais = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Devolução de Materiais</h1>
          <p className="text-muted-foreground">
            Registro de devoluções de materiais ao estoque
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Devolução
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Undo2 className="h-5 w-5" />
            Devoluções de Materiais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Página em construção - Devolução de materiais
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueDevolucaoMateriais;
