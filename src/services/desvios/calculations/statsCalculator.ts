
import { DashboardStats } from "../types/dashboardTypes";

export const calculatePercentages = (
  acoesCompletas: number,
  acoesAndamento: number,
  acoesPendentes: number,
  totalDesvios: number
): Pick<DashboardStats, 'percentualCompletas' | 'percentualAndamento' | 'percentualPendentes'> => {
  const total = totalDesvios || 1; // Evitar divisão por zero
  return {
    percentualCompletas: Math.round(((acoesCompletas || 0) / total) * 100),
    percentualAndamento: Math.round(((acoesAndamento || 0) / total) * 100),
    percentualPendentes: Math.round(((acoesPendentes || 0) / total) * 100),
  };
};

export const calculateRiskLevel = (riskData: any[]): string => {
  if (!riskData || riskData.length === 0) {
    return "Baixo";
  }

  const riskCounts = riskData.reduce((acc: any, item: any) => {
    acc[item.classificacao_risco] = (acc[item.classificacao_risco] || 0) + 1;
    return acc;
  }, {});
  
  const maxRisk = Object.keys(riskCounts).reduce((a, b) => 
    riskCounts[a] > riskCounts[b] ? a : b
  );
  
  return maxRisk || "Baixo";
};
