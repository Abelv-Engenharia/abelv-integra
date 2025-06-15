
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function MedidasDisciplinaresDashboard() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="text-primary" size={32} />
            Medidas Disciplinares
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Acompanhe o registro, monitoramento e gestão das medidas disciplinares aplicadas na empresa.
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          <Button asChild>
            <Link to="/medidas-disciplinares/cadastro">Cadastrar Nova Medida</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/medidas-disciplinares/consulta">Consultar Medidas</Link>
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Estes números podem ser integrados ao banco posteriormente */}
        <Card>
          <CardHeader>
            <CardTitle>Total de Medidas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">-</span>
            <div className="text-xs text-muted-foreground">No ano atual</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Com Anexo</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">-</span>
            <div className="text-xs text-muted-foreground">Com documento anexado</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Última Medida</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">-</span>
            <div className="text-xs text-muted-foreground">Data mais recente</div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground mb-10">
        <span>
          Utilize os botões acima para registrar ou consultar medidas disciplinares. Estatísticas detalhadas em breve!
        </span>
      </div>
    </div>
  );
}
