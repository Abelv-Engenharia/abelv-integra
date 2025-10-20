import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Percent } from "lucide-react";
import { DashboardStats as Stats } from "@/types/gestao-pessoas/travel";

interface DashboardStatsProps {
  stats: Stats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
          <Users className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalReservations}</div>
          <p className="text-xs opacity-80">Período atual</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
          <DollarSign className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</div>
          <p className="text-xs opacity-80">Período atual</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Onfly</CardTitle>
          <Percent className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.onflyPercentage.toFixed(1)}%</div>
          <p className="text-xs opacity-80">Participação no mercado</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Biztrip</CardTitle>
          <TrendingUp className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.biztripPercentage.toFixed(1)}%</div>
          <p className="text-xs opacity-80">Participação no mercado</p>
        </CardContent>
      </Card>
    </div>
  );
};