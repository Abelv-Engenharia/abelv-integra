
export interface Treinamento {
  id: string;
  nome: string;
  carga_horaria?: number;
  validade_dias?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExecucaoTreinamento {
  id?: string;
  data: Date | string;
  mes: number;
  ano: number;
  cca: string;
  cca_id?: number | null;
  processo_treinamento: string;
  processo_treinamento_id?: string | null;
  tipo_treinamento: string;
  tipo_treinamento_id?: string | null;
  treinamento_id?: string | null;
  treinamento_nome?: string | null;
  carga_horaria: number;
  efetivo_mod: number | null;
  efetivo_moi: number | null;
  horas_totais?: number | null;
  observacoes?: string | null;
  lista_presenca_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CCA {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
  ativo?: boolean;
}

export interface ProcessoTreinamento {
  id: string;
  codigo: string;
  nome: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TipoTreinamento {
  id: string;
  codigo: string;
  nome: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TreinamentoNormativo {
  id: string;
  funcionario_id: string;
  treinamento_id: string;
  data_realizacao: string;
  data_validade: string;
  tipo: string;
  status: string;
  certificado_url?: string;
  arquivado?: boolean;
  created_at?: string;
  updated_at?: string;
  treinamentoNome?: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  foto?: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}
