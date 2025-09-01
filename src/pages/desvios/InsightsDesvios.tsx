import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Filter, Eye, Plus, BarChart3, TrendingUp, Grid3X3 } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';

// Função utilitária para classificação de risco
function classificaRisco(score: number | null | undefined): string {
  if (score == null || isNaN(Number(score))) return "N/D";
  const n = Number(score);
  if (n <= 10) return "TRIVIAL";
  if (n <= 21) return "TOLERÁVEL";
  if (n <= 40) return "MODERADO";
  if (n <= 56) return "SUBSTANCIAL";
  return "INTOLERÁVEL";
}

// Cores para cada classificação
const RISK_COLORS = {
  "TRIVIAL": "#00CFFF",
  "TOLERÁVEL": "#6ADE7C",
  "MODERADO": "#FFD54F",
  "SUBSTANCIAL": "#FF9800",
  "INTOLERÁVEL": "#F44336",
  "N/D": "#9E9E9E"
};

interface InsightDesvio {
  id: string;
  gerado_em: string;
  escopo: string;
  classificacao_risco: string | null;
  tipo: string;
  resumo: string;
  recomendacao: string;
  dados: any;
}

interface FilterState {
  dateRange: { from: Date; to: Date };
  classificacoes: string[];
  tipos: string[];
  busca: string;
}

const InsightsDesvios = () => {
  const [insights, setInsights] = useState<InsightDesvio[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedInsight, setSelectedInsight] = useState<InsightDesvio | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [createTaskInsight, setCreateTaskInsight] = useState<InsightDesvio | null>(null);
  
  // Estados dos gráficos
  const [paretoData, setParetoData] = useState<any[]>([]);
  const [tendenciaData, setTendenciaData] = useState<any[]>([]);
  const [repeticaoData, setRepeticaoData] = useState<any[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  
  // Estado dos filtros
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      from: subDays(new Date(), 7),
      to: new Date()
    },
    classificacoes: ["TRIVIAL", "TOLERÁVEL", "MODERADO", "SUBSTANCIAL", "INTOLERÁVEL"],
    tipos: [],
    busca: ""
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const itemsPerPage = 20;

  // KPIs calculados
  const kpis = useMemo(() => {
    const insightsComClassificacao = insights.map(insight => ({
      ...insight,
      classificacao_calculada: insight.classificacao_risco ?? classificaRisco(insight.dados?.risco_score)
    }));

    const total = insightsComClassificacao.length;
    const moderado = insightsComClassificacao.filter(i => i.classificacao_calculada === "MODERADO").length;
    const substancial = insightsComClassificacao.filter(i => i.classificacao_calculada === "SUBSTANCIAL").length;
    const intoleravel = insightsComClassificacao.filter(i => i.classificacao_calculada === "INTOLERÁVEL").length;

    return {
      total,
      percentualModerado: total > 0 ? ((moderado / total) * 100).toFixed(1) : "0.0",
      percentualSubstancial: total > 0 ? ((substancial / total) * 100).toFixed(1) : "0.0",
      percentualIntoleravel: total > 0 ? ((intoleravel / total) * 100).toFixed(1) : "0.0"
    };
  }, [insights]);

  // Carregar dados dos gráficos
  const loadChartsData = async () => {
    try {
      setChartsLoading(true);
      
      // Dados mockados para demonstração
      setParetoData([
        { causa_raiz: "Falha de comunicação", qtde: 15, pct: 35 },
        { causa_raiz: "Procedimento inadequado", qtde: 12, pct: 28 },
        { causa_raiz: "Falta de treinamento", qtde: 8, pct: 19 },
        { causa_raiz: "Equipamento defeituoso", qtde: 5, pct: 12 },
        { causa_raiz: "Outros", qtde: 3, pct: 6 }
      ]);

      setTendenciaData([
        { semana: "S1", desvios_total: 25, desvios_alto_risco: 8 },
        { semana: "S2", desvios_total: 30, desvios_alto_risco: 12 },
        { semana: "S3", desvios_total: 22, desvios_alto_risco: 6 },
        { semana: "S4", desvios_total: 28, desvios_alto_risco: 9 }
      ]);

      setRepeticaoData([
        { local: "Área A", tarefa: "Soldagem", equipe: "Equipe 1", ocorrencias: 5, primeiro_reg: "2024-01-01", ultimo_reg: "2024-01-15" }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    } finally {
      setChartsLoading(false);
    }
  };

  // Carregar insights com filtros
  const loadInsights = async () => {
    try {
      setLoading(true);
      
      // Dados mockados para demonstração
      const mockInsights: InsightDesvio[] = [
        {
          id: "1",
          gerado_em: new Date().toISOString(),
          escopo: "Geral",
          classificacao_risco: "MODERADO",
          tipo: "Recomendação",
          resumo: "Identificado padrão de desvios relacionados à falta de EPIs na área de soldagem",
          recomendacao: "Implementar verificação sistemática de EPIs antes do início das atividades",
          dados: { risco_score: 35, area: "soldagem", equipamento: "EPIs" }
        },
        {
          id: "2", 
          gerado_em: subDays(new Date(), 1).toISOString(),
          escopo: "Área de Produção",
          classificacao_risco: "SUBSTANCIAL",
          tipo: "Sumário",
          resumo: "Aumento de 40% nos desvios de procedimento na última semana",
          recomendacao: "Reforçar treinamentos em procedimentos operacionais padrão",
          dados: { risco_score: 48, tendencia: "alta", periodo: "semanal" }
        },
        {
          id: "3",
          gerado_em: subDays(new Date(), 2).toISOString(),
          escopo: "Manutenção",
          classificacao_risco: null,
          tipo: "Tendência",
          resumo: "Padrão recorrente de falhas em equipamentos de segurança",
          recomendacao: "Revisar cronograma de manutenção preventiva",
          dados: { risco_score: 25, categoria: "equipamentos", frequencia: "mensal" }
        }
      ];

      // Aplicar filtros em memória para demonstração
      let filteredData = mockInsights;
      
      // Filtro por data
      filteredData = filteredData.filter(insight => {
        const dataInsight = new Date(insight.gerado_em);
        return dataInsight >= appliedFilters.dateRange.from && dataInsight <= appliedFilters.dateRange.to;
      });

      // Filtro por classificação
      if (appliedFilters.classificacoes.length < 5) {
        filteredData = filteredData.filter(insight => {
          const classificacao = insight.classificacao_risco ?? classificaRisco(insight.dados?.risco_score);
          return appliedFilters.classificacoes.includes(classificacao);
        });
      }

      // Filtro por tipo
      if (appliedFilters.tipos.length > 0) {
        filteredData = filteredData.filter(insight => appliedFilters.tipos.includes(insight.tipo));
      }

      // Filtro por busca
      if (appliedFilters.busca) {
        const busca = appliedFilters.busca.toLowerCase();
        filteredData = filteredData.filter(insight => 
          insight.resumo.toLowerCase().includes(busca) || 
          insight.recomendacao.toLowerCase().includes(busca)
        );
      }

      // Paginação
      const offset = (currentPage - 1) * itemsPerPage;
      const paginatedData = filteredData.slice(offset, offset + itemsPerPage);

      setInsights(paginatedData);
      setTotalCount(filteredData.length);
    } catch (error) {
      console.error('Erro ao carregar insights:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar insights",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChartsData();
  }, []);

  useEffect(() => {
    loadInsights();
  }, [appliedFilters, currentPage]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      dateRange: {
        from: subDays(new Date(), 7),
        to: new Date()
      },
      classificacoes: ["TRIVIAL", "TOLERÁVEL", "MODERADO", "SUBSTANCIAL", "INTOLERÁVEL"],
      tipos: [],
      busca: ""
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handleClassificacaoChange = (classificacao: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({
        ...prev,
        classificacoes: [...prev.classificacoes, classificacao]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        classificacoes: prev.classificacoes.filter(c => c !== classificacao)
      }));
    }
  };

  const handleTipoChange = (tipo: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({
        ...prev,
        tipos: [...prev.tipos, tipo]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        tipos: prev.tipos.filter(t => t !== tipo)
      }));
    }
  };

  const getRiskBadge = (insight: InsightDesvio) => {
    const classificacao = insight.classificacao_risco ?? classificaRisco(insight.dados?.risco_score);
    const color = RISK_COLORS[classificacao];
    
    return (
      <Badge 
        variant="secondary" 
        style={{ backgroundColor: color + '20', color: color, borderColor: color }}
        className="font-medium"
      >
        {classificacao}
      </Badge>
    );
  };

  const handleCreateTask = (insight: InsightDesvio) => {
    setCreateTaskInsight(insight);
    setShowCreateTaskModal(true);
    setSelectedInsight(null);
  };

  const handleSaveTask = async (taskData: any) => {
    toast({
      title: "Tarefa criada com sucesso",
      description: `Tarefa criada baseada no insight ${createTaskInsight?.tipo}`
    });
    setShowCreateTaskModal(false);
    setCreateTaskInsight(null);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Insights de Desvios</h1>
        <p className="text-muted-foreground mt-2">
          Análises diárias geradas pelo agente. Filtre por período, classificação e tipo para priorizar ações.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Insights</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total}</div>
            <p className="text-xs text-muted-foreground">No período selecionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% MODERADO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: RISK_COLORS.MODERADO }}>
              {kpis.percentualModerado}%
            </div>
            <p className="text-xs text-muted-foreground">Do total filtrado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% SUBSTANCIAL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: RISK_COLORS.SUBSTANCIAL }}>
              {kpis.percentualSubstancial}%
            </div>
            <p className="text-xs text-muted-foreground">Do total filtrado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% INTOLERÁVEL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: RISK_COLORS.INTOLERÁVEL }}>
              {kpis.percentualIntoleravel}%
            </div>
            <p className="text-xs text-muted-foreground">Do total filtrado</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Período */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - {format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: filters.dateRange.from, to: filters.dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setFilters(prev => ({
                          ...prev,
                          dateRange: { from: range.from!, to: range.to! }
                        }));
                      }
                    }}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Classificação de Risco */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Classificação de Risco</label>
              <div className="space-y-2">
                {Object.keys(RISK_COLORS).map(classificacao => (
                  <div key={classificacao} className="flex items-center space-x-2">
                    <Checkbox
                      id={classificacao}
                      checked={filters.classificacoes.includes(classificacao)}
                      onCheckedChange={(checked) => handleClassificacaoChange(classificacao, checked as boolean)}
                    />
                    <label htmlFor={classificacao} className="text-sm cursor-pointer">
                      {classificacao}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <div className="space-y-2">
                {["Recomendação", "Sumário", "Tendência", "Pareto", "Near-miss"].map(tipo => (
                  <div key={tipo} className="flex items-center space-x-2">
                    <Checkbox
                      id={tipo}
                      checked={filters.tipos.includes(tipo)}
                      onCheckedChange={(checked) => handleTipoChange(tipo, checked as boolean)}
                    />
                    <label htmlFor={tipo} className="text-sm cursor-pointer">
                      {tipo}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Busca</label>
              <Input
                placeholder="Buscar em resumo e recomendação..."
                value={filters.busca}
                onChange={(e) => setFilters(prev => ({ ...prev, busca: e.target.value }))}
              />
            </div>

            {/* Botões */}
            <div className="space-y-2">
              <label className="text-sm font-medium invisible">Ações</label>
              <div className="space-y-2">
                <Button onClick={handleApplyFilters} className="w-full">
                  Aplicar
                </Button>
                <Button onClick={handleClearFilters} variant="outline" className="w-full">
                  Limpar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pareto de Causas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Pareto de Causas (90 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Carregando...</p>
              </div>
            ) : paretoData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paretoData} layout="horizontal">
                  <XAxis type="number" />
                  <YAxis dataKey="causa_raiz" type="category" width={100} />
                  <Tooltip formatter={(value, name) => [`${value} (${paretoData.find(d => d.qtde === value)?.pct}%)`, 'Quantidade']} />
                  <Bar dataKey="qtde" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Pareto indisponível</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tendência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendência (12 semanas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Carregando...</p>
              </div>
            ) : tendenciaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tendenciaData}>
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="desvios_total" stroke="#8884d8" name="Total" />
                  <Line type="monotone" dataKey="desvios_alto_risco" stroke="#e74c3c" name="Alto Risco" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Tendência indisponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mapa de Repetições */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            Mapa de Repetições
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartsLoading ? (
            <div className="h-32 flex items-center justify-center">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : repeticaoData.length > 0 ? (
            <div className="text-sm text-muted-foreground">
              {repeticaoData.length} padrões de repetição identificados
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p className="text-muted-foreground">Repetições indisponível</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Gerados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando insights...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gerado em</TableHead>
                    <TableHead>Classificação de Risco</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Resumo</TableHead>
                    <TableHead>Recomendação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insights.map((insight) => (
                    <TableRow key={insight.id}>
                      <TableCell>
                        {format(new Date(insight.gerado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{getRiskBadge(insight)}</TableCell>
                      <TableCell>{insight.tipo}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={insight.resumo}>
                          {insight.resumo}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={insight.recomendacao}>
                          {insight.recomendacao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedInsight(insight)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleCreateTask(insight)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Criar Tarefa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages} ({totalCount} itens)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedInsight} onOpenChange={(open) => !open && setSelectedInsight(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhe do Insight</DialogTitle>
          </DialogHeader>
          {selectedInsight && (
            <div className="space-y-4">
              <div>
                <strong>Gerado em:</strong> {format(new Date(selectedInsight.gerado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </div>
              <div>
                <strong>Escopo:</strong> {selectedInsight.escopo}
              </div>
              <div>
                <strong>Classificação:</strong> {getRiskBadge(selectedInsight)}
              </div>
              <div>
                <strong>Tipo:</strong> {selectedInsight.tipo}
              </div>
              <div>
                <strong>Resumo:</strong> {selectedInsight.resumo}
              </div>
              <div>
                <strong>Recomendação:</strong> {selectedInsight.recomendacao}
              </div>
              <div>
                <strong>Dados:</strong>
                <pre className="mt-2 p-3 bg-muted rounded-md text-sm font-mono overflow-x-auto">
                  {JSON.stringify(selectedInsight.dados, null, 2)}
                </pre>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleCreateTask(selectedInsight)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Tarefa
                </Button>
                <Button variant="outline" onClick={() => setSelectedInsight(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Criar Tarefa */}
      <Dialog open={showCreateTaskModal} onOpenChange={setShowCreateTaskModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Tarefa</DialogTitle>
          </DialogHeader>
          {createTaskInsight && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Funcionalidade de criação de tarefa será implementada conforme integração com sistema existente.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => handleSaveTask({})}>
                  Salvar Tarefa
                </Button>
                <Button variant="outline" onClick={() => setShowCreateTaskModal(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InsightsDesvios;