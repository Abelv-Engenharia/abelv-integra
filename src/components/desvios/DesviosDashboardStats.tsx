
import { CheckCircle, Clock, AlertTriangle, Activity } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

interface DesviosDashboardStatsProps {
  loading: boolean;
  stats: {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
