export interface FuelTransaction {
  motorista: string;
  centro_custo: string;
  placa: string;
  modelo_veiculo: string;
  tipo_cartao: string;
  numero_cartao: string;
  data_hora_transacao: string;
  uf_ec: string;
  cidade_ec: string;
  nome_ec: string;
  tipo_mercadoria: string;
  mercadoria: string;
  qtd_mercadoria: number;
  valor: number;
  // Metadados
  data_upload: string;
  usuario_responsavel: string;
  id: string;
}

export interface FuelFilters {
  motorista?: string;
  centro_custo?: string;
  data_inicial?: Date;
  data_final?: Date;
  tipo_mercadoria?: string;
  cidade_ec?: string;
  uf_ec?: string;
}

export interface FuelImportResult {
  success: boolean;
  message: string;
  totalImported: number;
  errors?: string[];
}

export interface MotoristaDiv {
  motorista: string;
  matricula?: string;
  veiculo?: string;
  placa?: string;
  cca_principal: string;
  divisao_ccas: Array<{
    cca: string;
    percentual: number;
  }>;
  observacoes?: string;
}

export interface MapaMOI {
  id: string;
  mes_referencia: string; // "2025-01"
  ano_referencia: number;
  data_geracao: Date;
  motoristas: MotoristaDiv[];
  status: 'Pendente' | 'Ativo' | 'Arquivado';
  data_upload: string;
  usuario_responsavel: string;
}

export interface ProcessamentoQuinzenal {
  id: string;
  periodo: '1ª quinzena' | '2ª quinzena';
  mes_ano: string; // "2025-01"
  fatura_veloe: string;
  moi_aplicado?: string; // ID do MOI usado
  transacoes: FuelTransaction[];
  data_processamento: Date;
  total_valor: number;
  total_transacoes: number;
}

export interface DashboardData {
  moi_atual?: MapaMOI;
  primeira_quinzena?: ProcessamentoQuinzenal;
  segunda_quinzena?: ProcessamentoQuinzenal;
  mes_completo: boolean;
  alertas: string[];
}