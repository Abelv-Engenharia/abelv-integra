export type StatusPassivo = "ativo" | "quitado" | "parcial" | "pendente";

export interface HistoricoPassivo {
  id: string;
  data: Date;
  usuario: string;
  campo: string;
  valorAnterior: string;
  valorNovo: string;
  justificativa: string;
}

export interface ControlePassivos {
  id: string;
  prestadorid: string;
  nomeprestador: string;
  empresa: string;
  cargo: string;
  salariobase: number;
  dataadmissao: Date;
  datacorte: Date;
  saldoferias: number;
  decimoterceiro: number;
  avisopravio: number;
  total: number;
  status: StatusPassivo;
  historico?: HistoricoPassivo[];
  observacoes?: string;
  datacriacao: Date;
  dataatualizacao: Date;
}
