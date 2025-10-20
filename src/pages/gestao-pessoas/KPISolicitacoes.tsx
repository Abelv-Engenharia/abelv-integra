import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSolicitacoes } from "@/contexts/gestao-pessoas/SolicitacoesContext";
import { StatusSolicitacao } from "@/types/gestao-pessoas/solicitacao";
import { FaturaIntegra } from "@/types/gestao-pessoas/travel";
import { ClipboardList, CheckCircle2, Clock, AlertCircle, Plane, BarChart3 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Função para calcular dias úteis entre duas datas
const calcularDiasUteis = (dataInicio: Date, dataFim: Date): number => {
  let dias = 0;
  const atual = new Date(dataInicio);
  
  while (atual <= dataFim) {
    const diaSemana = atual.getDay();
    // 0 = Domingo, 6 = Sábado
    if (diaSemana !== 0 && diaSemana !== 6) {
      dias++;
    }
    atual.setDate(atual.getDate() + 1);
  }
  
  return dias;
};

export default function KPISolicitacoes() {
  const { solicitacoes } = useSolicitacoes();
  const [faturasViagens, setFaturasViagens] = useState<FaturaIntegra[]>([]);

  // Carregar faturas de viagens do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("faturas_integra");
    if (stored) {
      setFaturasViagens(JSON.parse(stored));
    }
  }, []);

  // Cálculo das estatísticas
  const stats = useMemo(() => {
    const total = solicitacoes.length;
    
    const concluidas = solicitacoes.filter(
      s => s.status === StatusSolicitacao.CONCLUIDO
    ).length;
    
    const emAndamento = solicitacoes.filter(
      s => s.status === StatusSolicitacao.EM_ANDAMENTO || 
         s.status === StatusSolicitacao.APROVADO
    ).length;
    
    const pendentes = solicitacoes.filter(
      s => s.status === StatusSolicitacao.PENDENTE
    ).length;

    // Cálculo de solicitações no prazo/fora do prazo
    const solicitacoesConcluidas = solicitacoes.filter(
      s => s.status === StatusSolicitacao.CONCLUIDO && s.dataconclusao
    );

    let noPrazo = 0;
    let foraPrazo = 0;

    solicitacoesConcluidas.forEach(sol => {
      if (sol.dataconclusao) {
        const diasUteis = calcularDiasUteis(
          sol.dataSolicitacao, 
          sol.dataconclusao
        );
        
        if (diasUteis <= 3) {
          noPrazo++;
        } else {
          foraPrazo++;
        }
      }
    });

    const totalComPrazo = noPrazo + foraPrazo;
    const percentualNoPrazo = totalComPrazo > 0 
      ? ((noPrazo / totalComPrazo) * 100).toFixed(1) 
      : "0";
    const percentualForaPrazo = totalComPrazo > 0 
      ? ((foraPrazo / totalComPrazo) * 100).toFixed(1) 
      : "0";

    return {
      total,
      concluidas,
      emAndamento,
      pendentes,
      noPrazo,
      foraPrazo,
      percentualNoPrazo,
      percentualForaPrazo
    };
  }, [solicitacoes]);

  // Dados para o gráfico de pizza
  const chartData = [
    { 
      name: "No Prazo", 
      value: stats.noPrazo, 
      fill: "hsl(142, 71%, 45%)" // verde
    },
    { 
      name: "Fora do Prazo", 
      value: stats.foraPrazo, 
      fill: "hsl(0, 84%, 60%)" // vermelho
    }
  ];

  const chartConfig = {
    noPrazo: {
      label: "No Prazo",
      color: "hsl(142, 71%, 45%)"
    },
    foraPrazo: {
      label: "Fora do Prazo",
      color: "hsl(0, 84%, 60%)"
    }
  };

  // Cálculo de estatísticas de conformidade de viagens
  const viagensStats = useMemo(() => {
    const dentroPolicy = faturasViagens.filter(f => f.dentrodapolitica === "Sim").length;
    const foraPolicy = faturasViagens.filter(f => f.dentrodapolitica === "Não").length;
    const total = dentroPolicy + foraPolicy;
    
    return {
      dentroPolicy,
      foraPolicy,
      total,
      percentualDentro: total > 0 ? ((dentroPolicy / total) * 100).toFixed(1) : "0",
      percentualFora: total > 0 ? ((foraPolicy / total) * 100).toFixed(1) : "0"
    };
  }, [faturasViagens]);

  // Dados para o gráfico de viagens
  const viagensChartData = [
    { 
      name: "Dentro da Política", 
      value: viagensStats.dentroPolicy, 
      fill: "hsl(142, 71%, 45%)" // verde
    },
    { 
      name: "Fora da Política", 
      value: viagensStats.foraPolicy, 
      fill: "hsl(0, 84%, 60%)" // vermelho
    }
  ];

  const viagensChartConfig = {
    dentroPolicy: {
      label: "Dentro da Política",
      color: "hsl(142, 71%, 45%)"
    },
    foraPolicy: {
      label: "Fora da Política",
      color: "hsl(0, 84%, 60%)"
    }
  };

  // Cálculo de estatísticas por motivo de viagem
  const motivosStats = useMemo(() => {
    interface MotivoStats {
      motivo: string;
      total: number;
      dentroPolicy: number;
      foraPolicy: number;
      percentualDentro: string;
      percentualFora: string;
    }

    // Agrupar por motivo
    const grupos = faturasViagens.reduce((acc, fatura) => {
      const motivo = fatura.motivoevento || "Não informado";
      
      if (!acc[motivo]) {
        acc[motivo] = {
          motivo,
          total: 0,
          dentroPolicy: 0,
          foraPolicy: 0,
          percentualDentro: "0",
          percentualFora: "0"
        };
      }
      
      acc[motivo].total++;
      if (fatura.dentrodapolitica === "Sim") {
        acc[motivo].dentroPolicy++;
      } else if (fatura.dentrodapolitica === "Não") {
        acc[motivo].foraPolicy++;
      }
      
      return acc;
    }, {} as Record<string, MotivoStats>);
    
    // Converter para array e calcular percentuais
    return Object.values(grupos)
      .map(grupo => ({
        ...grupo,
        percentualDentro: ((grupo.dentroPolicy / grupo.total) * 100).toFixed(1),
        percentualFora: ((grupo.foraPolicy / grupo.total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.total - a.total); // Ordenar por total (descendente)
  }, [faturasViagens]);

  // Dados para o gráfico de barras por motivo
  const motivosChartData = motivosStats.map(motivo => ({
    motivo: motivo.motivo,
    "Dentro da Política": parseFloat(motivo.percentualDentro),
    "Fora da Política": parseFloat(motivo.percentualFora),
    totalViagens: motivo.total,
    dentroQtd: motivo.dentroPolicy,
    foraQtd: motivo.foraPolicy
  }));

  // Tooltip customizado para o gráfico de barras
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <p className="text-sm mb-1">Total de viagens: {data.totalViagens}</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Dentro: {data.dentroQtd} ({data["Dentro da Política"].toFixed(1)}%)
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            Fora: {data.foraQtd} ({data["Fora da Política"].toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-primary">KPI - Solicitações de Serviços</h1>
        <p className="text-muted-foreground">
          Indicadores de performance das solicitações
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Solicitações */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Solicitações</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solicitações Concluídas */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Solicitações Concluídas</p>
                <p className="text-2xl font-bold">{stats.concluidas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solicitações em Andamento */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold">{stats.emAndamento}</p>
                <p className="text-xs text-muted-foreground">
                  (Aprovadas + Em Andamento)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solicitações Pendentes */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{stats.pendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Pizza - Atendimento no Prazo */}
      <Card>
        <CardHeader>
          <CardTitle>Atendimento no Prazo (≤ 3 Dias Úteis)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Percentual de solicitações atendidas dentro do prazo de 3 dias úteis
          </p>
        </CardHeader>
        <CardContent>
          {stats.noPrazo + stats.foraPrazo === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              <p>Nenhuma solicitação concluída ainda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gráfico */}
              <div className="h-[400px]">
                <ChartContainer config={chartConfig} className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(1)}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Estatísticas Detalhadas */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full" />
                      <div>
                        <p className="font-semibold text-green-700 dark:text-green-400">No Prazo</p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          Atendidas em até 3 dias úteis
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {stats.noPrazo}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-500">
                        {stats.percentualNoPrazo}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full" />
                      <div>
                        <p className="font-semibold text-red-700 dark:text-red-400">Fora do Prazo</p>
                        <p className="text-sm text-red-600 dark:text-red-500">
                          Atendidas após 3 dias úteis
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                        {stats.foraPrazo}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-500">
                        {stats.percentualForaPrazo}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Informações:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Total de solicitações concluídas: {stats.concluidas}</li>
                    <li>• Prazo de atendimento: 3 dias úteis</li>
                    <li>• Dias úteis: Segunda a Sexta-feira</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Conformidade com Política de Viagens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Conformidade com Política de Viagens
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Percentual de viagens realizadas dentro da política de compra estabelecida
          </p>
        </CardHeader>
        <CardContent>
          {viagensStats.total === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              <p>Nenhuma fatura de viagem cadastrada ainda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gráfico */}
              <div className="h-[400px]">
                <ChartContainer config={viagensChartConfig} className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={viagensChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(1)}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {viagensChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Estatísticas Detalhadas */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full" />
                      <div>
                        <p className="font-semibold text-green-700 dark:text-green-400">Dentro da Política</p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          Compras autorizadas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {viagensStats.dentroPolicy}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-500">
                        {viagensStats.percentualDentro}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full" />
                      <div>
                        <p className="font-semibold text-red-700 dark:text-red-400">Fora da Política</p>
                        <p className="text-sm text-red-600 dark:text-red-500">
                          Compras fora da política
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                        {viagensStats.foraPolicy}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-500">
                        {viagensStats.percentualFora}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Informações:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Total de viagens analisadas: {viagensStats.total}</li>
                    <li>• Viagens dentro da política: {viagensStats.dentroPolicy}</li>
                    <li>• Viagens fora da política: {viagensStats.foraPolicy}</li>
                    <li>• Conformidade: {viagensStats.percentualDentro}%</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Conformidade por Motivo de Viagem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Conformidade por Motivo de Viagem
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Análise de conformidade com a política de compra agrupada por motivo do evento
          </p>
        </CardHeader>
        <CardContent>
          {motivosStats.length === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              <p>Nenhuma viagem cadastrada ainda</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Gráfico de Barras */}
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={motivosChartData} 
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      type="number" 
                      domain={[0, 100]}
                      label={{ value: 'Percentual (%)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="motivo" 
                      width={90}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="Dentro da Política" 
                      stackId="a" 
                      fill="hsl(142, 71%, 45%)" 
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar 
                      dataKey="Fora da Política" 
                      stackId="a" 
                      fill="hsl(0, 84%, 60%)" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Tabela de Detalhes */}
              <div className="rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 font-semibold text-sm">Motivo</th>
                        <th className="text-center p-3 font-semibold text-sm">Total</th>
                        <th className="text-center p-3 font-semibold text-sm">Dentro da Política</th>
                        <th className="text-center p-3 font-semibold text-sm">Fora da Política</th>
                      </tr>
                    </thead>
                    <tbody>
                      {motivosStats.map((motivo, index) => (
                        <tr key={index} className="border-t hover:bg-muted/50">
                          <td className="p-3 text-sm font-medium">{motivo.motivo}</td>
                          <td className="p-3 text-sm text-center">{motivo.total}</td>
                          <td className="p-3 text-sm text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-green-700 dark:text-green-400 font-semibold">
                                {motivo.dentroPolicy}
                              </span>
                              <span className="text-xs text-green-600 dark:text-green-500">
                                ({motivo.percentualDentro}%)
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-red-700 dark:text-red-400 font-semibold">
                                {motivo.foraPolicy}
                              </span>
                              <span className="text-xs text-red-600 dark:text-red-500">
                                ({motivo.percentualFora}%)
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
