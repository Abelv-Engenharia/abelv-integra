import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FuelTransaction } from "@/types/gestao-pessoas/fuel";
import { DollarSign, Fuel, Car, Users } from "lucide-react";

interface FuelStatsProps {
  data: FuelTransaction[];
}

export const FuelStats: React.FC<FuelStatsProps> = ({ data }) => {
  const stats = React.useMemo(() => {
    if (data.length === 0) {
      return {
        totalTransactions: 0,
        totalValue: 0,
        uniqueVehicles: 0,
        uniqueDrivers: 0,
        avgTransactionValue: 0,
        totalQuantity: 0
      };
    }

    const totalValue = data.reduce((sum, item) => sum + item.valor, 0);
    const totalQuantity = data.reduce((sum, item) => sum + item.qtd_mercadoria, 0);
    const uniqueVehicles = new Set(data.map(item => item.placa)).size;
    const uniqueDrivers = new Set(data.map(item => item.motorista)).size;
    const avgTransactionValue = totalValue / data.length;

    return {
      totalTransactions: data.length,
      totalValue,
      uniqueVehicles,
      uniqueDrivers,
      avgTransactionValue,
      totalQuantity
    };
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalTransactions)}</div>
          <p className="text-xs text-muted-foreground">
            registros carregados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            média: {formatCurrency(stats.avgTransactionValue)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Veículos</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uniqueVehicles}</div>
          <p className="text-xs text-muted-foreground">
            veículos únicos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Motoristas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uniqueDrivers}</div>
          <p className="text-xs text-muted-foreground">
            motoristas únicos
          </p>
        </CardContent>
      </Card>
    </div>
  );
};