
export interface DashboardStats {
  totalDesvios: number;
  acoesCompletas: number;
  acoesAndamento: number;
  acoesPendentes: number;
  percentualCompletas: number;
  percentualAndamento: number;
  percentualPendentes: number;
  riskLevel: string;
}

export interface FilterParams {
  year?: string;
  month?: string;
  ccaId?: string;
  disciplinaId?: string;
  empresaId?: string;
}
