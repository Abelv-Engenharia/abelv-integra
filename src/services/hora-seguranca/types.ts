
export interface InspecoesSummary {
  totalInspecoes: number;
  programadas: number;
  naoProgramadas: number;
  desviosIdentificados: number;
  realizadas: number;
  canceladas: number;
  aRealizar?: number;
  naoRealizadas?: number;
  realizadasNaoProgramadas?: number;
}

export interface InspecaoRecentData {
  id: string;
  tipo: string;
  data: string;
  responsavel: string;
  status: string;
}

export interface RecentInspection {
  id: string;
  tipo: string;
  data: string;
  responsavel: string;
  status: string;
}

export interface HorasTrabalhadasData {
  mes: number;
  ano: number;
  total_horas: number;
}

export interface HorasTrabalhadasByMonth {
  month: string;
  horas: number;
}

export interface InspecoesByStatus {
  status: string;
  quantidade: number;
}

export interface InspecoesByTipo {
  tipo: string;
  quantidade: number;
}

export interface InspecoesStats {
  periodo: string;
  quantidade: number;
}

export interface InspecoesByMonth {
  mes: string;
  quantidade: number;
}

export interface InspecoesByResponsavel {
  responsavel: string;
  "A Realizar": number;
  "Realizada": number;
  "Não Realizada": number;
  "Realizada (Não Programada)": number;
  "Cancelada": number;
}

export interface DesviosByResponsavel {
  responsavel: string;
  desvios: number;
}

export interface DesviosByInspectionType {
  tipo: string;
  quantidade: number;
}

export interface InspecoesByCCA {
  cca: string;
  codigo: string;
  nomeCompleto: string;
  "A Realizar": number;
  "Realizada": number;
  "Não Realizada": number;
  "Realizada (Não Programada)": number;
  "Cancelada": number;
}
