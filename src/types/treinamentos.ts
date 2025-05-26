
export interface TreinamentoNormativo {
  id: string;
  funcionario_id: string;
  treinamento_id: string;
  tipo: string;
  data_realizacao: Date;
  data_validade: Date;
  status: string;
  certificado_url?: string;
  arquivado?: boolean;
  created_at?: string;
  updated_at?: string;
  // Additional fields for display
  funcionarioNome?: string;
  treinamentoNome?: string;
}

export interface ExecucaoTreinamento {
  id: string;
  treinamento_id?: string;
  treinamento_nome?: string;
  processo_treinamento: string;
  tipo_treinamento: string;
  carga_horaria: number;
  cca: string;
  cca_id?: number;
  data: Date;
  mes: number;
  ano: number;
  efetivo_mod?: number;
  efetivo_moi?: number;
  horas_totais?: number;
  observacoes?: string;
  lista_presenca_url?: string;
  created_at?: string;
  updated_at?: string;
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

export interface Treinamento {
  id: string;
  nome: string;
  carga_horaria?: number;
  validade_dias?: number;
  created_at?: string;
  updated_at?: string;
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
