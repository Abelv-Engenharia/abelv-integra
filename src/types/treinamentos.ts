
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
