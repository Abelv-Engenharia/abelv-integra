
export interface InspecoesByTipo {
  tipo: string;
  quantidade: number;
}

export interface RPCInspecoesByTipoResult {
  tipo: string;
  quantidade: number;
}

export interface RPCDesviosByInspectionTypeResult {
  tipo: string;
  quantidade: number;
}

export interface InspecoesByResponsavel {
  responsavel: string;
  quantidade: number;
}

export interface RPCInspecoesByResponsavelResult {
  responsavel: string;
  quantidade: number;
}

export interface InspecoesByStatus {
  status: string;
  quantidade: number;
  cor?: string;
}

export interface RPCInspecoesByStatusResult {
  status: string;
  quantidade: number;
}

export interface InspecoesStats {
  total: number;
  concluidas: number;
  emAndamento: number;
  pendentes: number;
  percentualConcluidas: number;
}

export interface RPCInspecoesStatsResult {
  total: number;
  concluidas: number;
  em_andamento: number;
  pendentes: number;
}

export interface InspecoesSummary {
  planejadas: number;
  realizadas: number;
  percentual: number;
  meta: number;
  diferenca: number;
}

export interface RPCInspecoesSummaryResult {
  planejadas: number;
  realizadas: number;
  meta: number;
}

export interface RecentInspection {
  id: string;
  tipo: string;
  responsavel: string;
  status: string;
  data: string;
}
