
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
