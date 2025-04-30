
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldAlert, ShieldCheck, TrendingUp, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchInspectionsSummary } from '@/services/horaSegurancaService';

export function InspecoesSummaryCards() {
  const [stats, setStats] = useState({
    totalInspecoes: 0,
    inspecoesMes: 0,
    inspecoesPendentes: 0,
    anomaliasEncontradas: 0,
    realizadas: 0,
    canceladas: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchInspectionsSummary();
        
        // Calculate realizadas (assuming they are the difference between total and pending)
        const realizadas = data.totalInspecoes - data.inspecoesPendentes;
        
        // Set 3 for canceled as a placeholder (this should come from the API)
        const canceladas = 3;
        
        setStats({
          ...data,
          realizadas,
          canceladas
        });
      } catch (err) {
        console.error("Error loading inspection stats:", err);
        setError("Não foi possível carregar as estatísticas de inspeções");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Calculate adherence
  const aderenciaHSA = stats.totalInspecoes > 0 
    ? (stats.realizadas / stats.totalInspecoes) * 100 
    : 0;

  // Determine adherence color based on percentage
  const getAdherenceColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-500";
    if (percentage >= 80) return "text-orange-500";
    return "text-red-500";
  };

  const adherenceColor = getAdherenceColor(aderenciaHSA);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 mt-2 bg-gray-200 animate-pulse rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aderência HSA</CardTitle>
          <TrendingUp className={cn("h-4 w-4", getAdherenceColor(aderenciaHSA))} />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", getAdherenceColor(aderenciaHSA))}>
            {aderenciaHSA.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Percentual de inspeções realizadas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Inspeções</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalInspecoes}</div>
          <p className="text-xs text-muted-foreground">
            Total de inspeções no período
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">A Realizar</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inspecoesPendentes}</div>
          <p className="text-xs text-muted-foreground">
            Inspeções pendentes de execução
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Realizadas</CardTitle>
          <ShieldCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.realizadas}</div>
          <p className="text-xs text-muted-foreground">
            Total de inspeções realizadas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Não Realizadas</CardTitle>
          <ShieldAlert className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.anomaliasEncontradas}</div>
          <p className="text-xs text-muted-foreground">
            Inspeções com desvios encontrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
          <XCircle className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.canceladas}</div>
          <p className="text-xs text-muted-foreground">
            Inspeções que foram canceladas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
