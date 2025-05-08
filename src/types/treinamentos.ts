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

export interface TreinamentoNormativo {
  id: string;
  funcionario_id: string;
  treinamento_id: string;
  data_realizacao: Date;
  data_validade: Date;
  tipo: string;
  status: string;
  funcionarioNome?: string;
  treinamentoNome?: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  matricula: string;
  funcao: string;
  ativo: boolean;
}

export interface Treinamento {
  id: string;
  nome: string;
  validade_dias?: number;
  carga_horaria?: number;
}

export interface ExecucaoTreinamento {
  id: string;
  treinamento_nome?: string;
  processo_treinamento: string;
  tipo_treinamento: string;
  carga_horaria: number;
  cca: string;
  data: Date;
  observacoes?: string;
  mes?: number;
  ano?: number;
}

export interface CCAOption {
  id: number;
  codigo: string;
  nome: string;
}
