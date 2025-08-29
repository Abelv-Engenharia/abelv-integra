
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, XCircle, Clock, FileSearch, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ConformidadePorMesChart } from "@/components/inspecao-sms/ConformidadePorMesChart";
import { ConformidadePorCCAChart } from "@/components/inspecao-sms/ConformidadePorCCAChart";

const InspecaoSMSDashboard = () => {
  const [stats, setStats] = useState({
    totalInspecoes: 0,
    conformes: 0,
    naoConformes: 0,
    pendentes: 0,
    esteMes: 0,
    mesAnterior: 0
  });
  const [ultimasInspecoes, setUltimasInspecoes] = useState<any[]>([]);
  const [inspecoesPorCCA, setInspecoesPorCCA] = useState<any[]>([]);
  const [conformidadePorMes, setConformidadePorMes] = useState<any[]>([]);
  const [conformidadePorCCA, setConformidadePorCCAChart] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [isLoading, setIsLoading] = useState(true);
  const { data: userCCAs = [] } = useUserCCAs();

  const loadStats = async () => {
    try {
      const now = new Date();
      const mesAtual = now.getMonth() + 1;
      const anoAtual = now.getFullYear();
      const mesAnterior = mesAtual === 1 ? 12 : mesAtual - 1;
      const anoMesAnterior = mesAtual === 1 ? anoAtual - 1 : anoAtual;
      
      // Filtrar por CCAs do usuário
      const ccaIds = userCCAs.length > 0 ? userCCAs.map(cca => cca.id) : [];
      
      let query = supabase
        .from('inspecoes_sms')
        .select(`
          *,
          checklists_avaliacao(nome),
          profiles(nome),
          ccas(codigo, nome)
        `)
        .order('created_at', { ascending: false });

      if (ccaIds.length > 0) {
        query = query.in('cca_id', ccaIds);
      }

      // Aplicar filtros de data se definidos
      if (dataInicio) {
        query = query.gte('data_inspecao', format(dataInicio, 'yyyy-MM-dd'));
      }

      if (dataFim) {
        query = query.lte('data_inspecao', format(dataFim, 'yyyy-MM-dd'));
      }


      const { data: inspecoes } = await query;

      if (inspecoes) {
        // Calcular estatísticas gerais
        const totalInspecoes = inspecoes.length;
        const conformes = inspecoes.filter(i => !i.tem_nao_conformidade).length;
        const naoConformes = inspecoes.filter(i => i.tem_nao_conformidade).length;
        const pendentes = inspecoes.filter(i => i.status === 'pendente').length;

        // Inspeções deste mês
        const esteMes = inspecoes.filter(i => {
          const dataInsp = new Date(i.data_inspecao);
          return dataInsp.getMonth() + 1 === mesAtual && dataInsp.getFullYear() === anoAtual;
        }).length;

        // Inspeções do mês anterior
        const mesAnteriorCount = inspecoes.filter(i => {
          const dataInsp = new Date(i.data_inspecao);
          return dataInsp.getMonth() + 1 === mesAnterior && dataInsp.getFullYear() === anoMesAnterior;
        }).length;

        setStats({
          totalInspecoes,
          conformes,
          naoConformes,
          pendentes,
          esteMes,
          mesAnterior: mesAnteriorCount
        });

        setUltimasInspecoes(inspecoes.slice(0, 8));

        // Agrupar por CCA
        const ccasCount = inspecoes.reduce((acc: any, insp) => {
          const cca = insp.ccas ? `${insp.ccas.codigo} - ${insp.ccas.nome}` : 'Sem CCA';
          acc[cca] = (acc[cca] || 0) + 1;
          return acc;
        }, {});

        setInspecoesPorCCA(
          Object.entries(ccasCount).map(([cca, count]) => ({ cca, count }))
        );

        // Processar dados para gráfico de conformidade por mês
        const conformidadeMes = inspecoes.reduce((acc: any, insp) => {
          const data = new Date(insp.data_inspecao);
          const mesAno = `${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
          
          if (!acc[mesAno]) {
            acc[mesAno] = { mes: mesAno, conformes: 0, naoConformes: 0 };
          }
          
          if (insp.tem_nao_conformidade) {
            acc[mesAno].naoConformes++;
          } else {
            acc[mesAno].conformes++;
          }
          
          return acc;
        }, {});

        const conformidadeMesArray = Object.values(conformidadeMes).sort((a: any, b: any) => {
          const [mesA, anoA] = a.mes.split('/');
          const [mesB, anoB] = b.mes.split('/');
          return new Date(parseInt(anoA), parseInt(mesA) - 1).getTime() - new Date(parseInt(anoB), parseInt(mesB) - 1).getTime();
        });
        
        setConformidadePorMes(conformidadeMesArray.slice(-12)); // Últimos 12 meses

        // Processar dados para gráfico de conformidade por CCA
        const conformidadeCCAData = inspecoes.reduce((acc: any, insp) => {
          const cca = insp.ccas ? `${insp.ccas.codigo}` : 'Sem CCA';
          
          if (!acc[cca]) {
            acc[cca] = { cca, conformes: 0, naoConformes: 0 };
          }
          
          if (insp.tem_nao_conformidade) {
            acc[cca].naoConformes++;
          } else {
            acc[cca].conformes++;
          }
          
          return acc;
        }, {});

        setConformidadePorCCAChart(Object.values(conformidadeCCAData));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const getStatusBadge = (status: string) => {
    const statusMap = {
      'concluida': { label: 'Concluída', variant: 'default' as const },
      'em_andamento': { label: 'Em Andamento', variant: 'secondary' as const },
      'pendente': { label: 'Pendente', variant: 'outline' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || 
      { label: status, variant: 'outline' as const };
    
    return (
      <Badge variant={statusInfo.variant} className="text-xs">
        {statusInfo.label}
      </Badge>
    );
  };

  const getConformidadeBadge = (temNaoConformidade: boolean) => {
    return (
      <Badge variant={temNaoConformidade ? "destructive" : "default"} className="text-xs">
        {temNaoConformidade ? "NC" : "OK"}
      </Badge>
    );
  };

  const calcularTendencia = () => {
    if (stats.mesAnterior === 0) return stats.esteMes > 0 ? 100 : 0;
    return ((stats.esteMes - stats.mesAnterior) / stats.mesAnterior) * 100;
  };

  const taxaConformidade = stats.totalInspecoes > 0 
    ? ((stats.conformes / stats.totalInspecoes) * 100) 
    : 0;

  useEffect(() => {
    if (userCCAs.length >= 0) {
      loadStats();
    }
  }, [userCCAs, dataInicio, dataFim]);

  return (
    <div className="content-padding section-spacing">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <FileSearch className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
        <h1 className="heading-responsive">Dashboard - Inspeção SMS</h1>
      </div>

      {/* Filtros */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="form-grid">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Início</label>
              <DatePickerWithManualInput
                value={dataInicio}
                onChange={setDataInicio}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Fim</label>
              <DatePickerWithManualInput
                value={dataFim}
                onChange={setDataFim}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadStats} className="w-full">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Inspeções</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInspecoes}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.esteMes} este mês
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformes</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.conformes}</div>
            <div className="text-xs text-muted-foreground">
              {stats.totalInspecoes > 0 ? `${((stats.conformes / stats.totalInspecoes) * 100).toFixed(1)}%` : '0%'} do total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Conformes</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.naoConformes}</div>
            <div className="text-xs text-muted-foreground">
              {stats.totalInspecoes > 0 ? `${((stats.naoConformes / stats.totalInspecoes) * 100).toFixed(1)}%` : '0%'} do total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conformidade</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {taxaConformidade.toFixed(1)}%
            </div>
            <Progress value={taxaConformidade} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Meta: 90%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Conformidade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Conformidade por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            {conformidadePorMes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum dado encontrado
              </p>
            ) : (
              <ConformidadePorMesChart data={conformidadePorMes} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Conformidade por CCA</CardTitle>
          </CardHeader>
          <CardContent>
            {conformidadePorCCA.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum dado encontrado
              </p>
            ) : (
              <ConformidadePorCCAChart data={conformidadePorCCA} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Inspeções por CCA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Inspeções por CCA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inspecoesPorCCA.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum dado encontrado
                </p>
              ) : (
                inspecoesPorCCA.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate mr-2">{item.cca}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-green-600 transition-all"
                          style={{ 
                            width: `${(item.count / stats.totalInspecoes) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default InspecaoSMSDashboard;
