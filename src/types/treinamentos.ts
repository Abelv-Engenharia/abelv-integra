
export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  foto?: string;
}

export interface Treinamento {
  id: string;
  nome: string;
  cargaHoraria?: number;
  validadeDias?: number; // Validade em dias
  tipo?: string; // Added tipo field
}

export interface TreinamentoNormativo {
  id: string;
  funcionarioId: string;
  treinamentoId: string;
  tipo: 'Formação' | 'Reciclagem';
  dataRealizacao: Date;
  dataValidade: Date;
  dataInicio: Date; // Added dataInicio field
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
  processoTreinamento: string;
  tipoTreinamento: string;
  treinamentoId: string;
  treinamentoNome?: string; // Para treinamentos inseridos manualmente
  cargaHoraria: number;
  observacoes?: string;
  listaPresencaUrl?: string;
}

// Mock data
export const MOCK_FUNCIONARIOS: Funcionario[] = [
  { id: '1', nome: 'João Silva', funcao: 'Operador', matricula: '12345' },
  { id: '2', nome: 'Maria Oliveira', funcao: 'Técnico de Segurança', matricula: '23456' },
  { id: '3', nome: 'Pedro Santos', funcao: 'Engenheiro', matricula: '34567' }
];

export const MOCK_TREINAMENTOS: Treinamento[] = [
  { id: '1', nome: 'NR10 - Segurança em instalações elétricas', cargaHoraria: 40, validadeDias: 730, tipo: 'Normativo' }, // 2 anos
  { id: '2', nome: 'NR35 - Trabalho em altura', cargaHoraria: 8, validadeDias: 730, tipo: 'Normativo' }, // 2 anos
  { id: '3', nome: 'NR33 - Espaço confinado', cargaHoraria: 16, validadeDias: 365, tipo: 'Normativo' }, // 1 ano
  { id: '4', nome: 'Brigada de incêndio', cargaHoraria: 8, validadeDias: 365, tipo: 'Segurança' }, // 1 ano
  { id: '5', nome: 'Primeiros socorros', cargaHoraria: 8, validadeDias: 730, tipo: 'Segurança' } // 2 anos
];

export const MOCK_TREINAMENTOS_NORMATIVOS: TreinamentoNormativo[] = [
  {
    id: '1',
    funcionarioId: '1',
    treinamentoId: '1',
    tipo: 'Formação',
    dataRealizacao: new Date('2023-05-15'),
    dataInicio: new Date('2023-05-10'), // Added
    dataValidade: new Date('2025-05-15'),
    status: 'Válido',
    arquivado: false
  },
  {
    id: '2',
    funcionarioId: '1',
    treinamentoId: '2',
    tipo: 'Formação',
    dataRealizacao: new Date('2023-10-10'),
    dataInicio: new Date('2023-10-05'), // Added
    dataValidade: new Date('2025-10-10'),
    status: 'Válido',
    arquivado: false
  }
];

export const MOCK_EXECUCAO_TREINAMENTOS: ExecucaoTreinamento[] = [
  {
    id: '1',
    data: new Date('2023-06-20'),
    mes: 6,
    ano: 2023,
    cca: 'Produção',
    processoTreinamento: 'Normativo',
    tipoTreinamento: 'Externo',
    treinamentoId: '1',
    cargaHoraria: 40,
    observacoes: 'Realizado com todos os operadores'
  },
  {
    id: '2',
    data: new Date('2023-07-15'),
    mes: 7,
    ano: 2023,
    cca: 'Manutenção',
    processoTreinamento: 'Comportamental',
    tipoTreinamento: 'Interno',
    treinamentoId: '3',
    cargaHoraria: 16,
    observacoes: 'Treinamento para equipe de manutenção'
  }
];

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
