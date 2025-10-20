import { ColunaRelatorio, ConfigModulo } from '@/types/gestao-pessoas/relatorio-prestadores';

export const COLUNAS_CADASTRO_PJ: ColunaRelatorio[] = [
  { key: 'nomecompleto', label: 'Nome completo', type: 'text', modulo: 'cadastro_pj' },
  { key: 'cpf', label: 'Cpf', type: 'cpf', modulo: 'cadastro_pj' },
  { key: 'razaosocial', label: 'Razão social', type: 'text', modulo: 'cadastro_pj' },
  { key: 'cnpj', label: 'Cnpj', type: 'cnpj', modulo: 'cadastro_pj' },
  { key: 'email', label: 'Email', type: 'email', modulo: 'cadastro_pj' },
  { key: 'telefone', label: 'Telefone', type: 'text', modulo: 'cadastro_pj' },
  { key: 'servico', label: 'Serviço', type: 'text', modulo: 'cadastro_pj' },
  { key: 'valorprestacaoservico', label: 'Valor prestação', type: 'currency', modulo: 'cadastro_pj' },
  { key: 'datainiciocontrato', label: 'Data início contrato', type: 'date', modulo: 'cadastro_pj' },
  { key: 'ccaobra', label: 'Cca/Obra', type: 'text', modulo: 'cadastro_pj' },
  { key: 'endereco', label: 'Endereço', type: 'text', modulo: 'cadastro_pj' },
  { key: 'cidade', label: 'Cidade', type: 'text', modulo: 'cadastro_pj' },
  { key: 'estado', label: 'Estado', type: 'text', modulo: 'cadastro_pj' },
];

export const COLUNAS_DEMONSTRATIVO: ColunaRelatorio[] = [
  { key: 'codigo', label: 'Código', type: 'text', modulo: 'demonstrativo' },
  { key: 'periodocontabil', label: 'Período contábil', type: 'text', modulo: 'demonstrativo' },
  { key: 'nome', label: 'Nome', type: 'text', modulo: 'demonstrativo' },
  { key: 'nomeempresa', label: 'Nome empresa', type: 'text', modulo: 'demonstrativo' },
  { key: 'salario', label: 'Salário', type: 'currency', modulo: 'demonstrativo' },
  { key: 'valornf', label: 'Valor nf', type: 'currency', modulo: 'demonstrativo' },
  { key: 'enviadoem', label: 'Enviado em', type: 'date', modulo: 'demonstrativo' },
  { key: 'status', label: 'Status', type: 'text', modulo: 'demonstrativo' },
];

export const COLUNAS_PASSIVOS: ColunaRelatorio[] = [
  { key: 'nomeprestador', label: 'Nome prestador', type: 'text', modulo: 'passivos' },
  { key: 'empresa', label: 'Empresa', type: 'text', modulo: 'passivos' },
  { key: 'cargo', label: 'Cargo', type: 'text', modulo: 'passivos' },
  { key: 'salariobase', label: 'Salário base', type: 'currency', modulo: 'passivos' },
  { key: 'dataadmissao', label: 'Data admissão', type: 'date', modulo: 'passivos' },
  { key: 'datacorte', label: 'Data corte', type: 'date', modulo: 'passivos' },
  { key: 'saldoferias', label: 'Saldo férias', type: 'currency', modulo: 'passivos' },
  { key: 'decimoterceiro', label: '13º salário', type: 'currency', modulo: 'passivos' },
  { key: 'avisopravio', label: 'Aviso prévio', type: 'currency', modulo: 'passivos' },
  { key: 'total', label: 'Total', type: 'currency', modulo: 'passivos' },
  { key: 'status', label: 'Status', type: 'text', modulo: 'passivos' },
];

export const COLUNAS_EMISSAO_NF: ColunaRelatorio[] = [
  { key: 'numeronf', label: 'Número nf', type: 'text', modulo: 'emissao_nf' },
  { key: 'prestador', label: 'Prestador', type: 'text', modulo: 'emissao_nf' },
  { key: 'empresa', label: 'Empresa', type: 'text', modulo: 'emissao_nf' },
  { key: 'valor', label: 'Valor', type: 'currency', modulo: 'emissao_nf' },
  { key: 'dataemissao', label: 'Data emissão', type: 'date', modulo: 'emissao_nf' },
  { key: 'status', label: 'Status', type: 'text', modulo: 'emissao_nf' },
];

export const COLUNAS_APROVACAO_NF: ColunaRelatorio[] = [
  { key: 'numeronf', label: 'Número nf', type: 'text', modulo: 'aprovacao_nf' },
  { key: 'prestador', label: 'Prestador', type: 'text', modulo: 'aprovacao_nf' },
  { key: 'valor', label: 'Valor', type: 'currency', modulo: 'aprovacao_nf' },
  { key: 'datasolicitacao', label: 'Data solicitação', type: 'date', modulo: 'aprovacao_nf' },
  { key: 'status', label: 'Status', type: 'text', modulo: 'aprovacao_nf' },
  { key: 'aprovadopor', label: 'Aprovado por', type: 'text', modulo: 'aprovacao_nf' },
];

export const COLUNAS_FERIAS: ColunaRelatorio[] = [
  { key: 'prestador', label: 'Prestador', type: 'text', modulo: 'ferias' },
  { key: 'datainicio', label: 'Data início', type: 'date', modulo: 'ferias' },
  { key: 'datafim', label: 'Data fim', type: 'date', modulo: 'ferias' },
  { key: 'dias', label: 'Dias', type: 'number', modulo: 'ferias' },
  { key: 'status', label: 'Status', type: 'text', modulo: 'ferias' },
];

export const COLUNAS_APROVACAO_FERIAS: ColunaRelatorio[] = [
  { key: 'prestador', label: 'Prestador', type: 'text', modulo: 'aprovacao_ferias' },
  { key: 'datainicio', label: 'Data início', type: 'date', modulo: 'aprovacao_ferias' },
  { key: 'datafim', label: 'Data fim', type: 'date', modulo: 'aprovacao_ferias' },
  { key: 'dias', label: 'Dias', type: 'number', modulo: 'aprovacao_ferias' },
  { key: 'datasolicitacao', label: 'Data solicitação', type: 'date', modulo: 'aprovacao_ferias' },
  { key: 'status', label: 'Status', type: 'text', modulo: 'aprovacao_ferias' },
  { key: 'aprovadopor', label: 'Aprovado por', type: 'text', modulo: 'aprovacao_ferias' },
];

export const COLUNAS_CONTRATOS: ColunaRelatorio[] = [
  { key: 'numero', label: 'Número do contrato', type: 'text', modulo: 'contratos' },
  { key: 'tipo', label: 'Tipo de contrato', type: 'text', modulo: 'contratos' },
  { key: 'prestador', label: 'Prestador', type: 'text', modulo: 'contratos' },
  { key: 'cpf', label: 'Cpf', type: 'cpf', modulo: 'contratos' },
  { key: 'cnpj', label: 'Cnpj', type: 'cnpj', modulo: 'contratos' },
  { key: 'servico', label: 'Serviço', type: 'text', modulo: 'contratos' },
  { key: 'valor', label: 'Valor do contrato', type: 'currency', modulo: 'contratos' },
  { key: 'dataemissao', label: 'Data de emissão', type: 'date', modulo: 'contratos' },
  { key: 'datainicio', label: 'Data de início', type: 'date', modulo: 'contratos' },
  { key: 'datafim', label: 'Data de término', type: 'date', modulo: 'contratos' },
  { key: 'status', label: 'Status', type: 'text', modulo: 'contratos' },
  { key: 'empresa', label: 'Empresa', type: 'text', modulo: 'contratos' },
  { key: 'obra', label: 'Obra/Cca', type: 'text', modulo: 'contratos' },
];

export const MODULOS_CONFIG: ConfigModulo[] = [
  {
    id: 'cadastro_pj',
    titulo: 'Cadastro de prestadores',
    icone: 'Building2',
    colunas: COLUNAS_CADASTRO_PJ,
    storageKey: 'cadastros_pessoa_juridica'
  },
  {
    id: 'contratos',
    titulo: 'Contratos emitidos',
    icone: 'FileSignature',
    colunas: COLUNAS_CONTRATOS,
    storageKey: 'contratos_emitidos'
  },
  {
    id: 'demonstrativo',
    titulo: 'Demonstrativos',
    icone: 'FileText',
    colunas: COLUNAS_DEMONSTRATIVO,
    storageKey: null
  },
  {
    id: 'passivos',
    titulo: 'Passivos trabalhistas',
    icone: 'Calculator',
    colunas: COLUNAS_PASSIVOS,
    storageKey: 'controle_passivos'
  },
  {
    id: 'emissao_nf',
    titulo: 'Emissão de nf',
    icone: 'Receipt',
    colunas: COLUNAS_EMISSAO_NF,
    storageKey: null
  },
  {
    id: 'aprovacao_nf',
    titulo: 'Aprovação de nf',
    icone: 'CheckCircle',
    colunas: COLUNAS_APROVACAO_NF,
    storageKey: null
  },
  {
    id: 'ferias',
    titulo: 'Solicitação de férias',
    icone: 'Palmtree',
    colunas: COLUNAS_FERIAS,
    storageKey: null
  },
  {
    id: 'aprovacao_ferias',
    titulo: 'Aprovação de férias',
    icone: 'ClipboardCheck',
    colunas: COLUNAS_APROVACAO_FERIAS,
    storageKey: null
  },
];
