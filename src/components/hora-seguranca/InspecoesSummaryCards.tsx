
import React, { useEffect, useState } from "react";
import { fetchInspecoesSummary } from "@/services/hora-seguranca";
import { Activity, Calendar, CheckSquare, FileWarning, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InspecoesSummary } from "@/services/hora-seguranca/types";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { supabase } from "@/integrations/supabase/client";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  className?: string;
}

interface Filters {
  ccaId?: number;
  responsavel?: string;
  dataInicial?: string;
  dataFinal?: string;
}

interface InspecoesSummaryCardsProps {
  filters?: Filters;
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
        
        // Aplicar filtros na consulta
        let query = supabase
          .from('execucao_hsa')
          .select('status')
          .in('cca_id', userCCAs.map(cca => cca.id));

        // Aplicar filtros adicionais
        if (filters?.ccaId) {
          query = query.eq('cca_id', filters.ccaId);
        }
        
        if (filters?.responsavel) {
          query = query.eq('responsavel_inspecao', filters.responsavel);
        }
        
        if (filters?.dataInicial) {
          query = query.gte('data', filters.dataInicial);
        }
        
        if (filters?.dataFinal) {
          query = query.lte('data', filters.dataFinal);
        }

        const { data: execucoes, error } = await query;
        
        if (error) {
          console.error('Erro ao buscar dados:', error);
          return;
        }

        // Processar dados
        const summary = {
          totalInspecoes: execucoes?.length || 0,
          programadas: 0,
          naoProgramadas: 0,
          desviosIdentificados: 0,
          realizadas: 0,
          canceladas: 0,
          aRealizar: 0,
          naoRealizadas: 0,
          realizadasNaoProgramadas: 0
        };

        execucoes?.forEach(item => {
          const status = (item.status || '').toUpperCase();
          switch (status) {
            case 'A REALIZAR':
              summary.aRealizar++;
              break;
            case 'REALIZADA':
              summary.realizadas++;
              break;
            case 'NÃO REALIZADA':
              summary.naoRealizadas++;
              break;
            case 'REALIZADA (NÃO PROGRAMADA)':
              summary.realizadasNaoProgramadas++;
              break;
            case 'CANCELADA':
              summary.canceladas++;
              break;
          }
        });

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
  const aderenciaReal = inspecoesProgramadas > 0 ? ((inspecoesRealizadas / inspecoesProgramadas) * 100).toFixed(2) : "0.00";
  
  // Aderência HSA (ajustada) = (REALIZADA + REALIZADA NÃO PROGRAMADA) / PROGRAMADAS * 100
  const realizadasAjustadas = inspecoesRealizadas + inspecoesNaoProgramadas;
  const aderenciaAjustada = inspecoesProgramadas > 0 ? ((realizadasAjustadas / inspecoesProgramadas) * 100).toFixed(2) : "0.00";

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
