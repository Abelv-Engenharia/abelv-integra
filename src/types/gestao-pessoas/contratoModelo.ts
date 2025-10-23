export type TipoContratoModelo = 'prestacao_servico' | 'aditivo' | 'distrato';

export interface ContratoModelo {
  id: string;
  nome: string;
  descricao: string | null;
  tipo_contrato: TipoContratoModelo;
  arquivo_url: string;
  arquivo_nome: string;
  codigos_disponiveis: string[];
  ativo: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface ContratoEmitidoFull {
  id: string;
  prestador_id: string;
  tipo_contrato: TipoContratoModelo;
  modelo_id: string | null;
  numero_contrato: string;
  dados_preenchidos: Record<string, any>;
  pdf_url: string | null;
  pdf_nome: string | null;
  email_enviado: boolean;
  email_enviado_em: string | null;
  status: 'rascunho' | 'confirmado' | 'enviado';
  data_inicio: string | null;
  data_fim: string | null;
  observacoes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
