
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldAlert, ShieldCheck, TrendingUp } from "lucide-react";

export function InspecoesSummaryCards() {
  // Calculate total inspections (only sum of 'a realizar', 'realizadas' and 'não realizadas')
  const aRealizar = 15;
  const realizadas = 28;
  const naoRealizadas = 5;
  const totalInspecoes = aRealizar + realizadas + naoRealizadas;
  
  // Calculate HSA adherence
  const aderenciaHSA = (realizadas / totalInspecoes) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aderência HSA</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aderenciaHSA.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Percentual de inspeções realizadas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Inspeções</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInspecoes}</div>
          <p className="text-xs text-muted-foreground">
            Total de inspeções no período
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Realizadas</CardTitle>
          <ShieldCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{realizadas}</div>
          <p className="text-xs text-muted-foreground">
            20 programadas + 8 não programadas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Não Realizadas</CardTitle>
          <ShieldAlert className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{naoRealizadas}</div>
          <p className="text-xs text-muted-foreground">
            Inspeções que não foram executadas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
