
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, Clock, Calendar, CalendarDays, TrendingUp, Shield } from "lucide-react";
import { fetchOcorrenciasStats } from "@/services/ocorrencias/ocorrenciasStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { useOcorrenciasFilter } from "@/contexts/OcorrenciasFilterContext";

const OcorrenciasSummaryCards = () => {
  const [stats, setStats] = useState({
    ocorrenciasComPerdaDias: 0,
    ocorrenciasSemPerdaDias: 0,
    incidentes: 0,
    desviosAltoPotencial: 0,
    totalDiasPerdidos: 0,
    totalDiasDebitados: 0,
    ocorrenciasConcluidas: 0,
    ocorrenciasPendentes: 0
  });
  const [loading, setLoading] = useState(true);
  const { data: userCCAs = [] } = useUserCCAs();
  const { year, month, ccaId } = useOcorrenciasFilter();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        console.log('Carregando estatísticas das ocorrências...');
        
        // Aplicar filtros
        let ccaIds = userCCAs.length > 0 ? userCCAs.map(cca => cca.id) : undefined;
        
        // Se um CCA específico foi selecionado, usar apenas ele
        if (ccaId !== 'todos') {
          ccaIds = [parseInt(ccaId)];
        }
        
        const data = await fetchOcorrenciasStats(ccaIds, year, month);
        
        console.log('Estatísticas carregadas:', data);
        setStats(data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    // Só carrega se já temos dados dos CCAs ou se não há CCAs (para mostrar vazio)
    if (userCCAs.length > 0 || userCCAs.length === 0) {
      loadStats();
    }
  }, [userCCAs, year, month, ccaId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i + 4}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primeira linha - Tipos de ocorrências */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências com perda de dias</CardTitle>
            <Activity className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ocorrenciasComPerdaDias}</div>
            <p className="text-xs text-muted-foreground">
              AC CPD - Acidentes com perda de dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências sem perda de dias</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ocorrenciasSemPerdaDias}</div>
            <p className="text-xs text-muted-foreground">
              AC SPD - Acidentes sem perda de dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incidentes}</div>
            <p className="text-xs text-muted-foreground">
              INC - Incidentes ambientais e materiais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desvios de Alto Potencial</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.desviosAltoPotencial}</div>
            <p className="text-xs text-muted-foreground">
              DAP - Desvios de alto potencial
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha - Dias e status de ocorrências */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dias Perdidos</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDiasPerdidos}</div>
            <p className="text-xs text-muted-foreground">
              Total de dias perdidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dias Debitados</CardTitle>
            <CalendarDays className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDiasDebitados}</div>
            <p className="text-xs text-muted-foreground">
              Total de dias debitados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ocorrenciasConcluidas}</div>
            <p className="text-xs text-muted-foreground">
              Ocorrências com status concluído
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ocorrenciasPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Ocorrências com status pendente
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OcorrenciasSummaryCards;
