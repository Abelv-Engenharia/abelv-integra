
import { InspecoesSummary } from "@/types/users";

// Types for inspeções
export interface Inspecao {
  id: string;
  data: string;
  tipo_inspecao: string;
  status: string;
  responsavel: string;
}

export interface InspecoesByStatus {
  name: string;
  value: number;
}

export interface InspecoesStatsByMonth {
  mes: number;
  concluidas: number;
  programadas: number;
}

export interface InspecoesByTipo {
  tipo: string;
  quantidade: number;
}

export interface InspecoesByResponsavel {
  responsavel: string;
  quantidade: number;
}
