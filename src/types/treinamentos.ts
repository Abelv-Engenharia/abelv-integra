
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
  data: string;
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

export interface TreinamentoFormValues {
  data: string;
  carga_horaria: number;
  cca_id: string;
  efetivo_mod: number;
  efetivo_moi: number;
  processo_treinamento_id: string;
  tipo_treinamento_id: string;
  treinamento_id: string;
  treinamento_nome?: string;
  observacoes: string;
  lista_presenca: string;
  lista_presenca_url?: string;
}

// Tipos para IDSMS
export interface IDSMSIndicador {
  id: string;
  data: string;
  mes: number;
  ano: number;
  cca_id: number;
  resultado: number;
  motivo?: string;
  tipo: 'IID' | 'HSA' | 'HT' | 'IPOM' | 'INSPECAO_ALTA_LIDERANCA' | 'INSPECAO_GESTAO_SMS' | 'INDICE_REATIVO';
  created_at?: string;
  updated_at?: string;
}

export interface IDSMSFormValues {
  data: string;
  cca_id: string;
  resultado: number;
  motivo?: string;
}

export interface IDSMSDashboardData {
  cca_id: number;
  cca_codigo: string;
  cca_nome: string;
  iid: number;
  hsa: number;
  ht: number;
  ipom: number;
  inspecao_alta_lideranca: number;
  inspecao_gestao_sms: number;
  indice_reativo: number;
  idsms_total: number;
}
