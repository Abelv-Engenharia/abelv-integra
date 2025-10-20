export interface Colaborador {
  id: string;
  nome: string;
  re: string;
  cpf: string;
  funcao: string;
  tipo_mo: 'MOD' | 'MOI' | 'terceiro';
  status_funcional: 'ativo' | 'em_mobilizacao' | 'desmobilizado';
  obra_id: string;
  obra_nome: string;
  obra_cca: string;
  dt_admissao: string;
  dt_cadastro: string;
}

export interface Documento {
  id: string;
  colaborador_id: string;
  tipo: string;
  arquivo_uri: string;
  validade?: string;
  status_doc: 'ok' | 'pendente' | 'vencido' | 'em_validacao' | 'nao_se_aplica';
  origem: string;
  hash: string;
  dt_upload: string;
  observacoes?: string;
}

export interface ChecklistMobilizacao {
  id: string;
  funcao: string;
  tipo_mo: 'MOD' | 'MOI' | 'terceiro';
  tipo_documento: string;
  obrigatorio: boolean;
  prazo_renovacao_dias: number;
  descricao: string;
}

export interface StatusColaborador {
  colaborador: Colaborador;
  status_geral: 'apto' | 'com_pendencias' | 'vencido' | 'em_validacao';
  documentos: Record<string, {
    status: 'ok' | 'pendente' | 'vencido' | 'em_validacao' | 'nao_se_aplica';
    validade?: string;
    dias_restantes?: number;
    observacoes?: string;
  }>;

  total_pendencias: number;
  total_vencidos: number;
}

export interface FiltrosMobilizacao {
  obra_ids: string[];
  status_doc: string[];
  funcao: string;
  tipo_mo: string;
  situacao: string;
  validade_de: string;
  validade_ate: string;
  search: string;
}

export interface KPIMobilizacao {
  total_colaboradores: number;
  colaboradores_aptos: number;
  colaboradores_pendentes: number;
  colaboradores_vencidos: number;
  documentos_a_vencer: number;
  documentos_vencidos: number;
  percentual_aptos: number;
}

export interface AlertaMobilizacao {
  id: string;
  colaborador_id: string;
  colaborador_nome: string;
  colaborador_re: string;
  obra_nome: string;
  tipo_documento: string;
  situacao: 'a_vencer' | 'vencido' | 'pendente';
  dias_para_vencimento?: number;
  validade?: string;
  gravidade: 'baixa' | 'media' | 'alta' | 'critica';
  dt_criacao: string;
}

export interface AuditoriaDownload {
  id: string;
  usuario_id: string;
  usuario_nome: string;
  colaborador_id: string;
  colaborador_nome: string;
  tipo: 'ZIP_DOCS' | 'RELATORIO_CSV' | 'CONSULTA';
  dt_evento: string;
  ip: string;
  filtros_snapshot: any;
  resultado: 'sucesso' | 'erro';
  detalhes?: string;
}

export interface ExportZipResponse {
  download_url: string;
  filename: string;
  expires_at: string;
  total_files: number;
  total_size_mb: number;
}