export interface AnaliseContratual {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Cliente/Projeto
  cca_codigo?: string;
  nome_cliente?: string;
  nome_projeto?: string;
  
  // Fornecedor
  fornecedor_id?: string;
  fornecedor_nome: string;
  fornecedor_cnpj: string;
  fornecedor_contato?: string;
  fornecedor_email?: string;
  
  // Locador
  nome_proprietario: string;
  cpf_proprietario?: string;
  tipo_locador?: string;
  imobiliaria?: string;
  
  // Endereço
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  
  // Contratual
  numero_contrato: string;
  valor_mensal: number;
  dia_vencimento: number;
  forma_pagamento: string;
  tem_ir: boolean;
  caucao?: number;
  meses_caucao?: number;
  conta_poupanca?: string;
  
  // Cálculo IR
  ir_base_calculo?: number;
  ir_aliquota?: number;
  ir_parcela_deduzir?: number;
  ir_valor_retido?: number;
  valor_liquido_pagar?: number;
  multa_rescisoria_percentual?: number;
  
  // Prazo
  data_inicio_contrato: string;
  data_fim_contrato: string;
  prazo_contratual?: number;
  
  // Vistoria
  tem_vistoria: boolean;
  vistoria_pdf_url?: string;
  
  // Cláusulas
  despesas_adicionais?: string;
  clausula_multa?: string;
  observacoes_clausulas?: string;
  
  // Documentação
  contrato_pdf_url: string;
  anexos: any[];
  
  // Análise
  responsavel_analise: string;
  status: 'pendente' | 'em_analise' | 'validado' | 'enviado_gestao';
  destinatarios_validacao: string[];
  texto_conclusao: string;
  destinatario_principal_email?: string;
  destinatario_principal_nome?: string;
  gestor_responsavel?: string;
  emails_adicionais?: string;
  
  // Resumo
  resumo_pdf_url?: string;
  
  // Vínculo
  contrato_definitivo_id?: string;
  
  // Validações
  status_financeiro?: string;
  observacao_financeiro?: string;
  validado_financeiro_por?: string;
  validado_financeiro_em?: string;
  
  status_adm?: string;
  observacao_adm?: string;
  validado_adm_por?: string;
  validado_adm_em?: string;
  
  status_gestor?: string;
  observacao_gestor?: string;
  validado_gestor_por?: string;
  validado_gestor_em?: string;
  
  status_super?: string;
  observacao_super?: string;
  validado_super_por?: string;
  validado_super_em?: string;
  
  status_geral?: string;
  
  // Fotos e Cláusulas
  fotos_imovel?: any[];
  usar_fotos_validacao?: boolean;
  clausulas_selecionadas?: any[];
  
  // Auditoria
  data_envio_validacao?: string;
  data_criacao_contrato?: string;
}
