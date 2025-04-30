
import { Activity, AlertTriangle, Calendar, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

interface DesviosDashboardStatsProps {
  loading: boolean;
  stats: {
    totalDesvios: number;
    desviosThisMonth: number;
    pendingActions: number;
    riskLevel: string;
  };
}

const DesviosDashboardStats = ({ loading, stats }: DesviosDashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Desvios"
        value={loading ? "..." : stats.totalDesvios}
        icon={<AlertTriangle className="h-4 w-4" />}
        description="Todos os desvios registrados"
        trend="up"
        trendValue="8%"
      />
      <StatCard
        title="Desvios no Mês"
        value={loading ? "..." : stats.desviosThisMonth}
        icon={<Calendar className="h-4 w-4" />}
        description={`Desvios deste mês`}
        trend="neutral"
        trendValue="2%"
      />
      <StatCard
        title="Ações Pendentes"
        value={loading ? "..." : stats.pendingActions}
        icon={<Clock className="h-4 w-4" />}
        description="Ações a serem realizadas"
        trend="down"
        trendValue="12%"
      />
      <StatCard
        title="Nível de Risco"
        value={loading ? "..." : stats.riskLevel}
        icon={<Activity className="h-4 w-4" />}
        description="Média de risco dos desvios"
        trend="up"
        trendValue="5%"
      />
    </div>
  );
};

export default DesviosDashboardStats;
