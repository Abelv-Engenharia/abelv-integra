import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface ResumoCustosProps {
  valorMensal: number;
  prazoMeses: number;
  dataInicio: string;
  dataFim: string;
  caucao?: number;
  mesesCaucao?: number;
  irRetido?: number;
  valorLiquido?: number;
}

export function ResumoCustos({
  valorMensal,
  prazoMeses,
  dataInicio,
  dataFim,
  caucao = 0,
  mesesCaucao = 0,
  irRetido = 0,
  valorLiquido = 0,
}: ResumoCustosProps) {
  const valorTotal = valorMensal * prazoMeses;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarData = (data: string) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Resumo de Custos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Valor Mensal</p>
            <p className="text-2xl font-bold">{formatarMoeda(valorMensal)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prazo Contratual</p>
            <p className="text-2xl font-bold">{prazoMeses} meses</p>
          </div>
        </div>

        {dataInicio && dataFim && (
          <div className="text-sm text-muted-foreground">
            {formatarData(dataInicio)} a {formatarData(dataFim)}
          </div>
        )}

        <div className="bg-background/50 p-3 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Valor Total do Contrato</p>
          <p className="text-3xl font-bold text-primary">{formatarMoeda(valorTotal)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatarMoeda(valorMensal)} × {prazoMeses} meses
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          {caucao > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">Caução</p>
              <p className="font-semibold">{formatarMoeda(caucao)}</p>
              <p className="text-xs text-muted-foreground">({mesesCaucao} meses)</p>
            </div>
          )}
          {irRetido > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">IR Retido Mensal</p>
              <p className="font-semibold">{formatarMoeda(irRetido)}</p>
            </div>
          )}
          {valorLiquido > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">Valor Líquido Mensal</p>
              <p className="font-semibold text-green-600">{formatarMoeda(valorLiquido)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
