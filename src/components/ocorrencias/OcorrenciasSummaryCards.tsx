
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { fetchOcorrenciasStats } from "@/services/ocorrencias/ocorrenciasStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

const OcorrenciasSummaryCards = () => {
  const [stats, setStats] = useState({
    totalOcorrencias: 0,
    acCpd: 0,
    acSpd: 0,
    inc: 0,
    totalAcoes: 0,
    acoesConcluidas: 0,
    acoesAndamento: 0,
    acoesPendentes: 0
  });
  const [loading, setLoading] = useState(true);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        console.log('Carregando estatísticas das ocorrências...');
        
        // Aplicar filtro por CCAs do usuário
        const ccaIds = userCCAs.length > 0 ? userCCAs.map(cca => cca.id) : undefined;
        const data = await fetchOcorrenciasStats(ccaIds);
        
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
  }, [userCCAs]);

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Ocorrências</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOcorrencias}</div>
          <p className="text-xs text-muted-foreground">
            AC CPD: {stats.acCpd} | AC SPD: {stats.acSpd} | INC: {stats.inc}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ações Concluídas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.acoesConcluidas}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalAcoes > 0 ? 
              `${Math.round((stats.acoesConcluidas / stats.totalAcoes) * 100)}% do total` 
              : 'Nenhuma ação cadastrada'
            }
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ações em Andamento</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.acoesAndamento}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalAcoes > 0 ? 
              `${Math.round((stats.acoesAndamento / stats.totalAcoes) * 100)}% do total` 
              : 'Nenhuma ação cadastrada'
            }
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ações Pendentes</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.acoesPendentes}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalAcoes > 0 ? 
              `${Math.round((stats.acoesPendentes / stats.totalAcoes) * 100)}% do total` 
              : 'Nenhuma ação cadastrada'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OcorrenciasSummaryCards;
