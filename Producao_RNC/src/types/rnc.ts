export interface RNC {
  id: string;
  numero: string;
  data: string;
  cca: string;
  emitente: string;
  setor_projeto: string;
  detectado_por: string;
  periodo_melhoria?: string;
  data_emissao: string;
  previsao_fechamento: string;
  
  // Origem
  origem: 'interna' | 'cliente' | 'fornecedor' | 'terceiro';
  
  // Priorização
  prioridade: 'critica' | 'moderada' | 'leve';
  
  // Disciplina/Setor
  disciplina: string[];
  disciplina_outros?: string;
  
  // Descrições
  descricao_nc: string;
  evidencias_nc: string;
  
  // Disposição
  disposicao: string[];
  empresa_disposicao?: string;
  responsavel_disposicao?: string;
  data_disposicao?: string;
  prazo_disposicao?: string;
  analise_disposicao?: string;
  
  // Análise da disposição
  eficacia?: 'eficaz' | 'nao_eficaz' | 'nova_nc';
  evidencia_disposicao?: string;
  
  // Anexos
  anexos_evidencias_nc?: FileAttachment[];
  anexos_evidencia_disposicao?: FileAttachment[];
  
  // Status
  status: 'aberta' | 'fechada';
  data_fechamento?: string;
  
  // Aprovações
  aprovacao_emitente?: boolean;
  aprovacao_qualidade?: boolean;
  aprovacao_cliente?: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface FileAttachment {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  attachment_type: 'evidencia_nc' | 'evidencia_disposicao';
  uploaded_by?: string;
  url?: string;
  description?: string;
  evidence_number?: number;
}

export const DISCIPLINAS = [
  'Civil', 'Mecânica', 'Elétrica', 'Tubulação',
  'HVAC', 'Estr. Metálica', 'Automação', 'Soldagem',
  'Suprimentos', 'Engenharia', 'TI', 'Pintura', 'Outros'
];

export const DISPOSICOES = [
  'Refugar', 'Aceitar', 'Aprovar Condicional', 'Analisar',
  'Retrabalhar', 'Reprovar', 'Concessão Cliente', 'Reinspeção',
  'Devolver', 'Fabricar Novo', 'Reclassificar', 'Treinar'
];

export const PRIORIDADE_COLORS = {
  critica: 'critical',
  moderada: 'warning',
  leve: 'success'
} as const;

export const STATUS_COLORS = {
  aberta: 'warning',
  fechada: 'success'
} as const;