
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
  status?: string;
  quantidade?: number;
  cor?: string;
  name: string;
  value: number;
}

export interface RPCInspecoesByStatusResult {
  status: string;
  quantidade: number;
}

export interface InspecoesStats {
  periodo: string;
  quantidade: number;
}

export interface RPCInspecoesStatsResult {
  total: number;
  concluidas: number;
  em_andamento: number;
  pendentes: number;
}

export interface InspecoesSummary {
  totalInspecoes: number;
  programadas: number;
  naoProgramadas: number;
  desviosIdentificados: number;
  realizadas: number;
  canceladas: number;
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
