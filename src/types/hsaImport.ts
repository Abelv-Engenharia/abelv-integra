export interface HSAImportData {
  data?: string | null;
  cca_codigo?: string;
  responsavel_inspecao?: string;
  funcao?: string;
  inspecao_programada?: string; // Sim/Não
  status?: string; // Realizada/Não Realizada/Não Programada
  desvios_identificados?: number;
  observacao?: string;
  relatorio_url?: string;
}