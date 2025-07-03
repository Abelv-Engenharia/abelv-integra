
import React, { useState, useEffect } from "react";
import { TrendingUp, CheckCircle2, GraduationCap } from "lucide-react";
import StatCard from "./StatCard";
import { fetchIDSMSPercentage } from "@/services/dashboard/idsmsStatsService";
import { fetchHSAPercentage } from "@/services/dashboard/hsaStatsService";
import { fetchTreinamentoInvestmentPercentage } from "@/services/dashboard/treinamentoStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

const DashboardTopStats = () => {
  const [idsmsPercentage, setIdsmsPercentage] = useState<number | null>(null);
  const [hsaPercentage, setHsaPercentage] = useState<number | null>(null);
  const [treinamentoPercentage, setTreinamentoPercentage] = useState<number | null>(null);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadStats = async () => {
      const ccaIds = userCCAs.length > 0 ? userCCAs.map(cca => cca.id) : undefined;
      
      try {
        console.log('Carregando estatísticas para CCAs:', ccaIds);
        
        const [idsms, hsa, treinamento] = await Promise.all([
          fetchIDSMSPercentage(ccaIds),
          fetchHSAPercentage(ccaIds),
          fetchTreinamentoInvestmentPercentage(ccaIds)
        ]);

        console.log('Resultado IDSMS:', idsms);
        console.log('Resultado HSA (Aderência Ajustada):', hsa);
        console.log('Resultado Treinamento:', treinamento);

        setIdsmsPercentage(idsms);
        setHsaPercentage(hsa);
        setTreinamentoPercentage(treinamento);
      } catch (error) {
        console.error('Erro ao carregar estatísticas do dashboard:', error);
        setIdsmsPercentage(0);
        setHsaPercentage(0);
        setTreinamentoPercentage(0);
      }
    };

    if (userCCAs.length >= 0) {
      loadStats();
    }
  }, [userCCAs]);

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <StatCard
        title="IDSMS Médio"
        value={idsmsPercentage === null ? "..." : `${idsmsPercentage}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        description="Percentual médio do IDSMS"
        trend={idsmsPercentage && idsmsPercentage > 75 ? "up" : idsmsPercentage && idsmsPercentage < 50 ? "down" : "neutral"}
        loading={idsmsPercentage === null}
        className="border-l-4 border-blue-500"
      />
      <StatCard
        title="HSA (Ajustada)"
        value={hsaPercentage === null ? "..." : `${hsaPercentage}%`}
        icon={<CheckCircle2 className="h-4 w-4" />}
        description="Aderência HSA incluindo não programadas"
        trend={hsaPercentage && hsaPercentage > 80 ? "up" : hsaPercentage && hsaPercentage < 60 ? "down" : "neutral"}
        loading={hsaPercentage === null}
        className="border-l-4 border-green-500"
      />
      <StatCard
        title="Treinamento"
        value={treinamentoPercentage === null ? "..." : `${treinamentoPercentage}%`}
        icon={<GraduationCap className="h-4 w-4" />}
        description="Percentual investido em treinamentos"
        trend={treinamentoPercentage && treinamentoPercentage > 5 ? "up" : treinamentoPercentage && treinamentoPercentage < 2 ? "down" : "neutral"}
        loading={treinamentoPercentage === null}
        className="border-l-4 border-purple-500"
      />
    </div>
  );
};

export default DashboardTopStats;
