import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, CheckCircle, Clock, AlertTriangle, Users, Fuel } from "lucide-react";
import { DashboardData, MapaMOI, ProcessamentoQuinzenal } from "@/types/gestao-pessoas/fuel";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardTabProps {
  dashboardData: DashboardData;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ dashboardData }) => {
  const { moi_atual, primeira_quinzena, segunda_quinzena, mes_completo, alertas } = dashboardData;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'Pendente': { variant: 'secondary' as const, label: 'Pendente' },
      'Ativo': { variant: 'default' as const, label: 'Ativo' },
      'Arquivado': { variant: 'outline' as const, label: 'Arquivado' }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.Pendente;
  };

  return (
    <div className="space-y-6">
      {/* Header com Status Geral */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Controle de Abastecimento</h2>
          <p className="text-muted-foreground">
            Mês atual: {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {mes_completo ? (
            <Badge variant="default" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Mês Completo
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-2">
              <Clock className="h-4 w-4" />
              Em Andamento
            </Badge>
          )}
        </div>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((alerta, index) => (
            <Alert key={index}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alerta}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status do MOI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mapa MOI Atual</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {moi_atual ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {format(moi_atual.data_geracao, 'dd/MM', { locale: ptBR })}
                  </span>
                  <Badge {...getStatusBadge(moi_atual.status)}>
                    {getStatusBadge(moi_atual.status).label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {moi_atual.motoristas.length} motoristas com divisão
                </p>
                <p className="text-xs text-muted-foreground">
                  Referência: {moi_atual.mes_referencia}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <p className="text-xs text-muted-foreground">
                  Mapa MOI não carregado
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 1ª Quinzena */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">1ª Quinzena</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {primeira_quinzena ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {primeira_quinzena.total_transacoes}
                  </span>
                  <Badge variant="default">✓</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(primeira_quinzena.total_valor)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fatura: {primeira_quinzena.fatura_veloe}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-muted-foreground">⏳</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando processamento
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2ª Quinzena */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2ª Quinzena</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {segunda_quinzena ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {segunda_quinzena.total_transacoes}
                  </span>
                  <Badge variant="default">✓</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(segunda_quinzena.total_valor)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fatura: {segunda_quinzena.fatura_veloe}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-muted-foreground">⏳</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando processamento
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo Mensal */}
      {(primeira_quinzena || segunda_quinzena) && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {(primeira_quinzena?.total_transacoes || 0) + (segunda_quinzena?.total_transacoes || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total de Transações</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    (primeira_quinzena?.total_valor || 0) + (segunda_quinzena?.total_valor || 0)
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Valor Total</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {moi_atual?.motoristas.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Motoristas c/ Divisão</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {mes_completo ? '100%' : `${primeira_quinzena && segunda_quinzena ? 100 : 50}%`}
                </div>
                <p className="text-xs text-muted-foreground">Progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline do Processo */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline do Processo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${moi_atual ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className="flex-1">
                <p className="font-medium">Mapa MOI Carregado</p>
                <p className="text-sm text-muted-foreground">
                  {moi_atual ? `Carregado em ${format(moi_atual.data_geracao, 'dd/MM/yyyy', { locale: ptBR })}` : 'Aguardando carregamento (~dia 20)'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${primeira_quinzena ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className="flex-1">
                <p className="font-medium">1ª Quinzena Processada</p>
                <p className="text-sm text-muted-foreground">
                  {primeira_quinzena ? `Processada em ${format(primeira_quinzena.data_processamento, 'dd/MM/yyyy', { locale: ptBR })}` : 'Aguardando fatura Veloe (1-15)'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${segunda_quinzena ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className="flex-1">
                <p className="font-medium">2ª Quinzena Processada</p>
                <p className="text-sm text-muted-foreground">
                  {segunda_quinzena ? `Processada em ${format(segunda_quinzena.data_processamento, 'dd/MM/yyyy', { locale: ptBR })}` : 'Aguardando fatura Veloe (16-31)'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${mes_completo ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className="flex-1">
                <p className="font-medium">Mês Consolidado</p>
                <p className="text-sm text-muted-foreground">
                  {mes_completo ? 'Relatórios disponíveis para contabilidade' : 'Aguardando conclusão das quinzenas'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};