export enum StatusFerias {
  SOLICITADO = "solicitado",
  AGUARDANDO_APROVACAO = "aguardando_aprovacao", 
  APROVADO = "aprovado",
  EM_FERIAS = "em_ferias",
  CONCLUIDO = "concluido",
  REPROVADO = "reprovado"
}

export interface ControleFérias {
  id: string;
  nomePrestador: string;
  empresa: string;
  funcaoCargo: string;
  obraLocalAtuacao: string;
  dataInicioFerias: Date;
  periodoAquisitivo: string;
  diasFerias: number;
  responsavelRegistro: string;
  responsavelDireto: string;
  observacoes?: string;
  anexos?: string[];
  status: StatusFerias;
  justificativaReprovacao?: string;
  dataAprovacao?: Date;
  dataCriacao: Date;
  dataUltimaAtualizacao: Date;
  historicoStatus: HistoricoStatus[];
}

export interface HistoricoStatus {
  status: StatusFerias;
  data: Date;
  usuario: string;
  observacao?: string;
}

export interface AlertaFerias {
  id: string;
  tipo: 'inicio_proximo' | 'retorno_hoje';
  prestador: string;
  data: Date;
  diasRestantes?: number;
}