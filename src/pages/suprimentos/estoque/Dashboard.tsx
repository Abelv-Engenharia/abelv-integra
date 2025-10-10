import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const EstoqueDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard de Estoque</h1>
        <p className="text-muted-foreground">
          Visão geral do controle de estoque
        </p>
      </div>

      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <Package className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">
            Página em construção
          </h2>
          <p className="text-muted-foreground">
            Dashboard de estoque em desenvolvimento
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EstoqueDashboard;
