
import React, { useEffect, useState } from "react";
import { fetchInspecoesSummary } from "@/services/hora-seguranca";
import { Activity, Calendar, CheckSquare, FileWarning, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InspecoesSummary } from "@/services/hora-seguranca/types";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { FilterOptions } from "@/pages/hora-seguranca/HoraSegurancaDashboard";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, value, description, icon, className }: StatCardProps) => (
  <Card className={className}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="p-2 bg-primary/10 rounded-full text-primary">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

interface InspecoesSummaryCardsProps {
  filters?: FilterOptions;
}

const InspecoesSummaryCards = ({ filters }: InspecoesSummaryCardsProps) => {
  const [data, setData] = useState<InspecoesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (userCCAs.length === 0) {
          setData({
            totalInspecoes: 0,
            programadas: 0,
            naoProgramadas: 0,
            desviosIdentificados: 0,
            realizadas: 0,
            canceladas: 0,
            aRealizar: 0,
            naoRealizadas: 0,
            realizadasNaoProgramadas: 0
          });
          setLoading(false);
          return;
        }
        
        // Aplicar filtro por CCAs permitidos
        const ccaIds = userCCAs.map(cca => cca.id);
        const summary = await fetchInspecoesSummary(ccaIds, filters);
        setData(summary);
      } catch (error) {
        console.error("Error loading inspeções summary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userCCAs, filters]);

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Cálculos corrigidos usando os dados reais do serviço
  const inspecoesProgramadas = (data?.aRealizar || 0) + (data?.realizadas || 0) + (data?.naoRealizadas || 0);
  const inspecoesRealizadas = data?.realizadas || 0;
  const inspecoesNaoProgramadas = data?.realizadasNaoProgramadas || 0;
  const inspecoesNaoRealizadas = data?.naoRealizadas || 0;
  
  // Aderência HSA (real) = REALIZADA / (A REALIZAR + REALIZADA + NÃO REALIZADA) * 100
  const aderenciaReal = inspecoesProgramadas > 0 ? Math.round((inspecoesRealizadas / inspecoesProgramadas) * 100) : 0;
  
  // Aderência HSA (ajustada) = (REALIZADA + REALIZADA NÃO PROGRAMADA) / (A REALIZAR + REALIZADA + REALIZADA NÃO PROGRAMADA + NÃO REALIZADA) * 100
  const totalAjustado = inspecoesProgramadas + inspecoesNaoProgramadas;
  const realizadasAjustadas = inspecoesRealizadas + inspecoesNaoProgramadas;
  const aderenciaAjustada = totalAjustado > 0 ? Math.round((realizadasAjustadas / totalAjustado) * 100) : 0;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
      <StatCard
        title="Aderência HSA (real)"
        value={`${aderenciaReal}%`}
        icon={<Target className="h-5 w-5" />}
        className="border-l-4 border-green-500"
        description="Realizadas vs Programadas"
      />
      <StatCard
        title="Aderência HSA (ajustada)"
        value={`${aderenciaAjustada}%`}
        icon={<TrendingUp className="h-5 w-5" />}
        className="border-l-4 border-blue-500"
        description="Incluindo não programadas"
      />
      <StatCard
        title="Inspeções Programadas"
        value={inspecoesProgramadas}
        icon={<Activity className="h-5 w-5" />}
        className="border-l-4 border-purple-500"
        description="A realizar + Realizadas + Não realizadas"
      />
      <StatCard
        title="Inspeções Realizadas"
        value={inspecoesRealizadas}
        icon={<CheckSquare className="h-5 w-5" />}
        className="border-l-4 border-green-500"
        description="Inspeções concluídas"
      />
      <StatCard
        title="Não Programadas"
        value={inspecoesNaoProgramadas}
        icon={<Calendar className="h-5 w-5" />}
        className="border-l-4 border-amber-500"
        description="Realizadas não programadas"
      />
      <StatCard
        title="Não Realizadas"
        value={inspecoesNaoRealizadas}
        icon={<FileWarning className="h-5 w-5" />}
        className="border-l-4 border-red-500"
        description="Inspeções não executadas"
      />
    </div>
  );
};

export default InspecoesSummaryCards;
