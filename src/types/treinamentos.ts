
export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  foto?: string;
  ativo: boolean;
  data_admissao?: string | null;
  // Add funcionario_ccas relationship
  funcionario_ccas?: { id: string; cca_id: number; ccas: { id: number; codigo: string; nome: string } }[];
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
  tipo: 'Formação' | 'Reciclagem';
  data_realizacao: string;
  data_validade: string;
  certificado_url?: string;
  status: string;
  arquivado: boolean;
  treinamentoNome?: string;
}

export interface Treinamento {
  id: string;
  nome: string;
  validade_dias?: number;
  carga_horaria?: number;
}

export interface TreinamentoFormData {
  ccaId: string;
  funcionarioId: string;
  funcao: string;
  matricula: string;
  treinamentoId: string;
  tipo: 'Formação' | 'Reciclagem';
  dataRealizacao: string;
  certificadoFile?: File;
}

export interface TreinamentoFormValues {
  ccaId: string;
  funcionarioId: string;
  funcao: string;
  matricula: string;
  treinamentoId: string;
  tipo: 'Formação' | 'Reciclagem';
  dataRealizacao: string;
  certificadoFile?: File;
}

// Training execution specific types
export interface TreinamentoExecucaoFormValues {
  data: string;
  mes: number;
  ano: number;
  cca_id: number;
  processo_treinamento_id: string;
  tipo_treinamento_id: string;
  treinamento_id: string;
  treinamento_nome: string;
  carga_horaria: number;
  efetivo_mod: number;
  efetivo_moi: number;
  observacoes: string;
  lista_presenca_url: string;
}

export interface ExecucaoTreinamento {
  id: string;
  cca: string;
  data: string;
  tipo_treinamento: string;
  processo_treinamento: string;
  carga_horaria: number;
  efetivo_mod: number;
  efetivo_moi: number;
  horas_totais: number;
  observacoes?: string;
  lista_presenca_url?: string;
  ano: number;
  mes: number;
  cca_id?: number;
  treinamento_id?: string;
  treinamento_nome?: string;
  processo_treinamento_id?: string;
  tipo_treinamento_id?: string;
}

export interface IDSMSIndicador {
  id: string;
  tipo: 'IID' | 'HSA' | 'HT' | 'IPOM' | 'INSPECAO_ALTA_LIDERANCA' | 'INSPECAO_GESTAO_SMS' | 'INDICE_REATIVO';
  resultado: number;
  data: string;
  cca_id: number;
  ano: number;
  mes: number;
  motivo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IDSMSFormValues {
  tipo: string;
  resultado: number;
  data: string;
  cca_id: number;
  motivo?: string;
}

// Correct structure for IDSMS Dashboard Data
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
