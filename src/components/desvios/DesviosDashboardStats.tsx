
import { CheckCircle, Clock, AlertTriangle, Activity, TrendingUp, TrendingDown } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";

interface DesviosDashboardStatsProps {
  loading: boolean;
  stats: {
    indiceDesvios: number;
    indiceDesviosStatus: 'positivo' | 'negativo';
    totalDesvios: number;
    acoesCompletas: number;
    acoesAndamento: number;
    acoesPendentes: number;
    percentualCompletas: number;
    percentualAndamento: number;
    percentualPendentes: number;
    riskLevel: string;
  };
}

const DesviosDashboardStats = ({ loading, stats }: DesviosDashboardStatsProps) => {
  console.log('DesviosDashboardStats renderizando com:', { loading, stats });
  console.log('Stats recebidos:', JSON.stringify(stats, null, 2));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="relative">
        <Badge 
          className={`absolute top-2 right-2 z-10 text-xs font-semibold ${
            stats.indiceDesviosStatus === 'positivo' 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {stats.indiceDesviosStatus === 'positivo' ? 'Positivo' : 'Negativo'}
        </Badge>
        <StatCard
          title="Índice de Desvios"
          value={loading ? "..." : stats.indiceDesvios.toFixed(2)}
          icon={stats.indiceDesviosStatus === 'positivo' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          description="Desvios por funcionário ativo"
          trend={stats.indiceDesviosStatus === 'positivo' ? 'up' : 'down'}
          trendValue={`${stats.indiceDesviosStatus === 'positivo' ? '≥' : '<'} 1.0`}
          className={`border-l-4 ${stats.indiceDesviosStatus === 'positivo' ? 'border-green-500' : 'border-red-500'}`}
          loading={loading}
        />
      </div>
      <StatCard
        title="Total de Desvios"
        value={loading ? "..." : stats.totalDesvios.toString()}
        icon={<Activity className="h-4 w-4" />}
        description="Todos os desvios registrados"
        trend="up"
        trendValue="8%"
        loading={loading}
      />
      <StatCard
        title="Ações Concluídas"
        value={loading ? "..." : `${stats.acoesCompletas} (${stats.percentualCompletas.toFixed(2)}%)`}
        icon={<CheckCircle className="h-4 w-4" />}
        description="Ações finalizadas"
        trend="up"
        trendValue={`${stats.percentualCompletas.toFixed(2)}%`}
        className="border-l-4 border-green-500"
        loading={loading}
      />
      <StatCard
        title="Ações em Andamento"
        value={loading ? "..." : `${stats.acoesAndamento} (${stats.percentualAndamento.toFixed(2)}%)`}
        icon={<Clock className="h-4 w-4" />}
        description="Ações sendo executadas"
        trend="neutral"
        trendValue={`${stats.percentualAndamento.toFixed(2)}%`}
        className="border-l-4 border-orange-500"
        loading={loading}
      />
      <StatCard
        title="Ações Pendentes"
        value={loading ? "..." : `${stats.acoesPendentes} (${stats.percentualPendentes.toFixed(2)}%)`}
        icon={<AlertTriangle className="h-4 w-4" />}
        description="Ações a serem iniciadas"
        trend="down"
        trendValue={`${stats.percentualPendentes.toFixed(2)}%`}
        className="border-l-4 border-red-500"
        loading={loading}
      />
    </div>
  );
};

export default DesviosDashboardStats;
