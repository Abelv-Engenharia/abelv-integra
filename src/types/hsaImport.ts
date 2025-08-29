export interface HSAImportData {
  data?: string | null;
  cca_codigo?: string;
  responsavel_inspecao?: string;
  funcao?: string;
  tipo_inspecao?: string; // Ex: Bloqueio de Energias, Documentação de Atividade, etc.
  status?: string; // Realizada/Não Realizada/Não Programada
  desvios_identificados?: number;
  observacao?: string;
  relatorio_url?: string;
}