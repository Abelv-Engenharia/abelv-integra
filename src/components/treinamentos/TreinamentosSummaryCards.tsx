import React from "react";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  Users,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

export const TreinamentosSummaryCards = ({
  stats,
  isLoading = false
}: { stats?: any; isLoading?: boolean }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Funcionários Capacitados"
        value={isLoading ? "..." : stats?.funcionariosComTreinamentos || "0"}
        icon={<Users className="h-4 w-4" />}
        description="Treinamentos normativos Válidos ou a Vencer"
        loading={isLoading}
      />
      <StatCard
        title="Treinamentos Executados"
        value={isLoading ? "..." : stats?.totalTreinamentosExecutados || "0"}
        icon={<LayoutDashboard className="h-4 w-4" />}
        description="Quant. execuções no período"
        loading={isLoading}
      />
      <StatCard
        title="Horas Treinamento (%)"
        value={isLoading ? "..." : `${(stats?.percentualHorasInvestidas||0).toFixed(2)}%`}
        icon={<Calendar className="h-4 w-4" />}
        description={`Meta: 2,5% (${(stats?.metaHoras||0).toLocaleString()}h)`}
        loading={isLoading}
        trend={stats?.metaAtingida ? "up" : "down"}
        trendValue={(stats?.percentualHorasInvestidas||0).toFixed(2)}
      />
      <StatCard
        title="Treinamentos Vencendo"
        value={isLoading ? "..." : stats?.treinamentosVencendo || "0"}
        icon={<FileText className="h-4 w-4" />}
        description="Próximos aos vencimentos"
        loading={isLoading}
      />
    </div>
  );
};
