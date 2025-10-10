import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const EstoqueConfiguracoesArcabouco = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações do Arcabouço</h1>
        <p className="text-muted-foreground">
          Configurações gerais do sistema de estoque
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Parâmetros do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Página em construção - Configurações do arcabouço de estoque
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueConfiguracoesArcabouco;
