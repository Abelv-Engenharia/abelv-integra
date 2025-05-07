
export interface DashboardStats {
  totalOcorrencias: number;
  ocorrenciasThisMonth: number;
  pendingActions: number;
  riskLevel: string;
}

export interface OcorrenciasStats {
  totalOcorrencias: number;
  ocorrenciasMes: number;
  ocorrenciasPendentes: number;
  riscoPercentage: number;
}

export interface OcorrenciasByTipo {
  name: string;
  value: number;
}

export interface OcorrenciasByRisco {
  name: string;
  value: number;
}

export interface OcorrenciasByEmpresa {
  name: string;
  value: number;
}

export interface OcorrenciasTimeline {
  month: string;
  ocorrencias: number;
}

export interface ParteCorpoData {
  name: string;
  value: number;
}
