
export interface InspecoesSummary {
  totalInspecoes: number;
  programadas: number;
  naoProgramadas: number;
  desviosIdentificados: number;
}

export interface InspecoesByTipo {
  name: string;
  value: number;
}

export interface InspecoesByStatus {
  name: string;
  value: number;
}

export interface InspecoesByResponsavel {
  name: string;
  value: number;
}

export interface InspecoesStats {
  month: string;
  Concluída: number;
  Pendente: number;
  Cancelada: number;
}

export interface RecentInspection {
  id: string;
  tipo: string;
  responsavel: string;
  status: string;
  data: string;
}

// Declare RPC function return types
export type RPCInspecoesByTipoResult = InspecoesByTipo[];
export type RPCInspecoesByStatusResult = { name: string, value: number }[];
export type RPCInspecoesByResponsavelResult = InspecoesByResponsavel[];
export type RPCInspecoesSummaryResult = InspecoesSummary[];
export type RPCInspecoesStatsResult = InspecoesStats[];
export type RPCDesviosByInspectionTypeResult = InspecoesByTipo[];
