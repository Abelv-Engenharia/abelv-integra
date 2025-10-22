export interface Document {
  id: string;
  numero: string;
  numeroAbelv?: string;
  titulo: string;
  disciplina: string;
  tipo: string;
  formato: string;
  versaoAtual: string;
  dataRevisao: string;
  status: 'elaboracao' | 'revisao' | 'aprovado' | 'obsoleto';
  responsavelEmissao: string;
  responsavelRevisao: string;
  cliente: string;
  projeto: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRevision {
  id: string;
  documentId: string;
  revisao: string;
  data: string;
  responsavel: string;
  descricao: string;
  status: 'elaboracao' | 'revisao' | 'aprovado' | 'obsoleto';
}

export interface GRD {
  id: string;
  numero: string;
  cca: string;
  folha: string;
  dataEnvio: string;
  remetente: string;
  destinatario: string;
  documentos: GRDDocument[];
  providencias: {
    aprovar: boolean;
    arquivar: boolean;
    assinatura: boolean;
    comentar: boolean;
    devolver: boolean;
    informacao: boolean;
    revisar: boolean;
    liberadoConstrucao: boolean;
    liberadoDetalhamento: boolean;
    liberadoComentarios: boolean;
    liberadoRevisao: boolean;
    emitirParecer: boolean;
    outros: string;
  };
  observacoes?: string;
  createdAt: string;
}

export interface GRDDocument {
  documentId: string;
  discriminacao: string;
  revisao: string;
  numeroFolhas: number;
  numeroCopias: number;
  tipoVia: 'O' | 'C' | 'M' | 'W'; // Original, Cópia, Meio Magnético, Outros
}

export type DocumentStatus = 'elaboracao' | 'revisao' | 'aprovado' | 'obsoleto';

export const DISCIPLINAS = [
  'Civil',
  'Estrutural', 
  'Arquitetura',
  'Elétrica',
  'Mecânica',
  'Instrumentação',
  'Processo',
  'HSE',
  'Qualidade',
  'Outros'
] as const;

export const TIPOS_DOCUMENTO = [
  'Projeto Básico',
  'Projeto Executivo',
  'Memorial Descritivo',
  'Especificação Técnica',
  'Lista de Materiais',
  'Manual',
  'Relatório',
  'Desenho',
  'Outros'
] as const;

export const FORMATOS = [
  'PDF',
  'DOCX',
  'XLSX',
  'DWG',
  'PDF/A',
  'Outros'
] as const;