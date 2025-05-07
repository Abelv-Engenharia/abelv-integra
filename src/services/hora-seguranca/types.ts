
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
