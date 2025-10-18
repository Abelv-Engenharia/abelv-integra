import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export default function RiscosFuncao() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Riscos por Função</h1>
          <p className="text-muted-foreground">
            Cadastro e gerenciamento de riscos ocupacionais por função
          </p>
        </div>
        <Button>
          <Activity className="mr-2 h-4 w-4" />
          Novo Cadastro
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionalidade em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta funcionalidade está em desenvolvimento e em breve estará disponível.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
