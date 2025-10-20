import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaturaIntegra } from "@/types/travel";
import { BarChart3, Calendar, DollarSign, FileText, TrendingUp } from "lucide-react";

interface ReportSummaryProps {
  data: FaturaIntegra[];
  selectedColumnsCount: number;
}

export function ReportSummary({ data, selectedColumnsCount }: ReportSummaryProps) {
  const totalRecords = data.length;
  const totalValue = data.reduce((sum, item) => sum + (item.valorpago || 0), 0);
  
  const dates = data
    .map(item => item.dataemissaofat)
    .filter(Boolean)
    .sort();
  const periodStart = dates[0] || '-';
  const periodEnd = dates[dates.length - 1] || '-';

  const onflyCount = data.filter(item => item.agencia === 'Onfly').length;
  const biztripCount = data.filter(item => item.agencia === 'Biztrip').length;
  
  const dentroPolicy = data.filter(item => item.dentrodapolitica === 'Sim').length;
  const conformityRate = totalRecords > 0 ? (dentroPolicy / totalRecords) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Resumo do Relatório
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Total de Registros</span>
            </div>
            <p className="text-2xl font-bold">{totalRecords}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Valor Total</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Período</span>
            </div>
            <p className="text-sm font-medium">
              {formatDate(periodStart)} - {formatDate(periodEnd)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Colunas Selecionadas</span>
            </div>
            <p className="text-2xl font-bold">{selectedColumnsCount}/27</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>Conformidade</span>
            </div>
            <p className="text-2xl font-bold">{conformityRate.toFixed(1)}%</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Distribuição por Agência</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Onfly: {onflyCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Biztrip: {biztripCount}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Conformidade com Política</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Dentro: {dentroPolicy}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Fora: {totalRecords - dentroPolicy}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
