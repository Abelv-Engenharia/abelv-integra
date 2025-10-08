
export interface DashboardStats {
  indiceDesvios: number;
  indiceDesviosStatus: 'positivo' | 'negativo';
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
  ccaIds?: string[]; // Add support for multiple CCA IDs
  disciplinaId?: string;
  empresaId?: string;
  dataInicio?: string; // ISO date string
  dataFim?: string;    // ISO date string
}
