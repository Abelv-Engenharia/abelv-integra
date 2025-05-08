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
  cargaHoraria?: number;
  validadeDias?: number; // Validade em dias
}

export interface TreinamentoNormativo {
  id: string;
  funcionarioId: string;
  treinamentoId: string;
  tipo: 'Formação' | 'Reciclagem';
  dataRealizacao: Date;
  dataValidade: Date;
  certificadoUrl?: string;
  status: 'Válido' | 'Próximo ao vencimento' | 'Vencido';
  arquivado: boolean; // Para histórico
}

export interface ExecucaoTreinamento {
  id: string;
  data: Date;
  mes: number;
  ano: number;
  cca: string;
  cca_id?: number;
  processoTreinamento: string;
  tipoTreinamento: string;
  treinamentoId?: string;
  treinamentoNome?: string;
  cargaHoraria: number;
  observacoes?: string;
  listaPresencaUrl?: string;
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
