export interface CommercialSpreadsheet {
  id: string;
  pc: string; // 5 dígitos obrigatórios
  dataSaidaProposta: string; // formato DD/MM/AAAA
  orcamentoDuplicado: 'Sim' | 'Não';
  segmento: 
    | 'Infraestrutura'
    | 'Químico e Petroquímico'
    | 'Óleo e Gás'
    | 'Siderurgia e Metalurgia'
    | 'Fertilizantes e Cimento'
    | 'Papel e Celulose'
    | 'Mineração'
    | 'Farmacêutica e Cosmético'
    | 'Alimentícia e Bebidas'
    | 'Automobilística'
    | 'Vidro e Borracha'
    | 'Shopping'
    | 'Residencial'
    | 'Galpão'
    | 'Comercial Predial'
    | 'Hospitalar'
    | 'Data Center';
  cliente: string;
  obra: string;
  vendedor: string;
  numeroRevisao: number;
  valorVenda: number;
  margemPercentual: number; // Percentual de margem Abelv
  margemValor: number; // Valor monetário da margem Abelv
  status: 
    | 'Estimativa'
    | 'Contemplado'
    | 'On Hold'
    | 'Perdido'
    | 'Cancelado'
    | 'Pré-Venda';
  // Campos de consolidação (obrigatórios quando status = 'Contemplado')
  dataassinaturacontratoreal?: string; // formato DD/MM/AAAA
  dataterminocontratoprevista?: string; // formato DD/MM/AAAA
  dataentregaorcamentoexecutivoprevista?: string; // formato DD/MM/AAAA
  dataentregaorcamentoexecutivoreal?: string; // formato DD/MM/AAAA
}

export interface CommercialFilters {
  pc?: string;
  cliente?: string;
  segmento?: string;
  status?: string;
  vendedor?: string;
  dataInicio?: string;
  dataFim?: string;
  ano?: string;
}

export interface AnnualGoals {
  id: string;
  ano: number;
  metaAnual: number;
  metaT1: number;
  metaT2: number;
  metaT3: number;
  metaT4: number;
  criadoEm: string;
  ativo: boolean;
}