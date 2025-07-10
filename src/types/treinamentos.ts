

export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  foto?: string;
  ativo: boolean;
  cca_id?: number;
  ccas?: { id: number; codigo: string; nome: string };
  data_admissao?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CCA {
  id: number;
  codigo: string;
  nome: string;
}

export interface TreinamentoNormativo {
  id: string;
  funcionario_id: string;
  treinamento_id: string;
  treinamentoNome?: string;
  data_realizacao: string;
  data_validade?: string;
  certificado_url?: string;
  observacoes?: string;
  status: string;
  tipo?: string;
  arquivado?: boolean;
}

export interface Treinamento {
  id: string;
  nome: string;
  descricao?: string;
  carga_horaria?: number;
  validade_dias?: number;
  created_at?: string;
  updated_at?: string;
}

// IDSMS types
export interface IDSMSIndicador {
  id: string;
  cca_id: number;
  tipo: 'IID' | 'HSA' | 'HT' | 'IPOM' | 'INSPECAO_ALTA_LIDERANCA' | 'INSPECAO_GESTAO_SMS' | 'INDICE_REATIVO';
  data: string;
  ano: number;
  mes: number;
  resultado: number;
  motivo?: string;
  created_at?: string;
  updated_at?: string;
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

export interface IDSMSFormValues {
  data: string;
  cca_id: string;
  resultado: number;
  motivo?: string;
}

// Training execution types
export interface ExecucaoTreinamento {
  id: string;
  data: string;
  mes: number;
  ano: number;
  cca: string;
  cca_id?: number;
  tipo_treinamento: string;
  tipo_treinamento_id?: string;
  processo_treinamento: string;
  processo_treinamento_id?: string;
  treinamento_nome?: string;
  treinamento_id?: string;
  carga_horaria: number;
  efetivo_mod?: number;
  efetivo_moi?: number;
  horas_totais?: number;
  lista_presenca_url?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TreinamentoFormValues {
  data: string;
  cca_id: string;
  tipo_treinamento_id: string;
  processo_treinamento_id: string;
  treinamento_id?: string;
  treinamento_nome?: string;
  carga_horaria: number;
  efetivo_mod: number;
  efetivo_moi: number;
  observacoes?: string;
  ano?: number;
  mes?: number;
  lista_presenca?: FileList | null;
  lista_presenca_url?: string;
}
