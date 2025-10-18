import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function Turmas() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Turmas</h1>
          <p className="text-muted-foreground">
            Cadastro e gerenciamento de turmas de treinamento
          </p>
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Nova Turma
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
