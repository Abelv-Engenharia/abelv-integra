export interface NotaFiscal {
  id: string;
  numero: string;
  
  // Campos da Emissão
  nomeempresa: string;
  nomerepresentante: string;
  periodocontabil: string; // formato: "MM/YYYY"
  cca: string;
  dataemissao: string;
  descricaoservico: string;
  valor: number;
  arquivo: File | null;
  arquivonome?: string; // Para quando não temos o File object
  arquivourl?: string; // URL do arquivo no storage
  
  // Campos da Aprovação
  tipodocumento?: "NFSE" | "NFe" | "NFS" | "Outros";
  empresadestino?: string; // Ex: "Abelv Engenharia"
  numerocredor?: string;
  datavencimento?: string;
  planofinanceiro?: string;
  statusaprovacao?: "Pendente" | "Aprovado" | "Reprovado";
  observacoesaprovacao?: string;
  
  // Campos de controle
  status: "Rascunho" | "Aguardando Aprovação" | "Aprovado" | "Reprovado" | "Erro";
  dataenviosienge?: string;
  mensagemerro?: string;
  criadoem: string;
  atualizadoem?: string;
  aprovadopor?: string; // usuário que aprovou
  dataaprovacao?: string;
}
