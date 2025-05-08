
// Basic entity types
export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  foto?: string;
  ativo: boolean;
}

export interface Treinamento {
  id: string;
  nome: string;
  carga_horaria?: number;
  validade_dias?: number; // Validade em dias
}

export interface TreinamentoNormativo {
  id: string;
  funcionario_id: string;
  treinamento_id: string;
  tipo: 'Formação' | 'Reciclagem';
  data_realizacao: Date;
  data_validade: Date;
  certificado_url?: string;
  status: 'Válido' | 'Próximo ao vencimento' | 'Vencido';
  arquivado: boolean; // Para histórico
  treinamentoNome?: string;
  funcionarioNome?: string;
}

export interface ExecucaoTreinamento {
  id: string;
  data: Date;
  mes: number;
  ano: number;
  cca: string;
  cca_id?: number;
  processo_treinamento: string;
  tipo_treinamento: string;
  treinamento_id?: string;
  treinamento_nome?: string;
  carga_horaria: number;
  observacoes?: string;
  lista_presenca_url?: string;
}

export const OPCOES_CCA = [
  'Produção', 
  'Manutenção', 
  'Administrativo', 
  'Logística', 
  'Qualidade',
  'Segurança',
  'Meio Ambiente',
  'RH'
];

export const OPCOES_PROCESSO_TREINAMENTO = [
  'Normativo',
  'Técnico',
  'Comportamental',
  'Integração',
  'Desenvolvimento'
];

export const OPCOES_TIPO_TREINAMENTO = [
  'Interno',
  'Externo',
  'EAD',
  'Híbrido'
];

// For the InspecoesSummary interface
export interface InspecoesSummary {
  totalInspecoes: number;
  programadas: number;
  naoProgramadas: number;
  desviosIdentificados: number;
  realizadas?: number;
  canceladas?: number;
}

export interface InspecoesByTipo {
  tipo: string;
  quantidade: number;
}

export interface InspecoesByStatus {
  status: string;
  quantidade: number;
}

export interface RPCInspecoesByResponsavelResult {
  responsavel: string;
  quantidade: number;
}

export interface RPCDesviosByInspectionTypeResult {
  tipo: string;
  quantidade: number;
}
