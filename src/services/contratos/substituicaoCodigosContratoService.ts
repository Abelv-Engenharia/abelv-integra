import { PrestadorPJ } from "@/types/gestao-pessoas/prestador";

// Códigos disponíveis para substituição em contratos
export const CODIGOS_CONTRATO_DISPONIVEIS = [
  // Dados do Prestador
  '{{PRESTADOR_RAZAO_SOCIAL}}',
  '{{PRESTADOR_NOME_COMPLETO}}',
  '{{PRESTADOR_CNPJ}}',
  '{{PRESTADOR_CPF}}',
  '{{PRESTADOR_INSCRICAO_ESTADUAL}}',
  '{{PRESTADOR_INSCRICAO_MUNICIPAL}}',
  '{{PRESTADOR_ENDERECO}}',
  '{{PRESTADOR_CEP}}',
  '{{PRESTADOR_CIDADE}}',
  '{{PRESTADOR_ESTADO}}',
  '{{PRESTADOR_TELEFONE}}',
  '{{PRESTADOR_EMAIL}}',
  
  // Dados Financeiros
  '{{VALOR_PRESTACAO_SERVICO}}',
  '{{VALOR_PRESTACAO_SERVICO_EXTENSO}}',
  '{{AJUDA_CUSTO}}',
  '{{AJUDA_CUSTO_EXTENSO}}',
  '{{AUXILIO_CONVENIO_MEDICO}}',
  '{{AUXILIO_ALUGUEL}}',
  '{{VALE_REFEICAO}}',
  '{{CAFE_MANHA}}',
  '{{CAFE_TARDE}}',
  '{{ALMOCO}}',
  '{{VALOR_TOTAL_MENSAL}}',
  '{{VALOR_TOTAL_MENSAL_EXTENSO}}',
  
  // Dados do Contrato
  '{{NUMERO_CONTRATO}}',
  '{{DATA_INICIO_CONTRATO}}',
  '{{DATA_FIM_CONTRATO}}',
  '{{PRAZO_CONTRATO}}',
  '{{FORMA_PAGAMENTO}}',
  '{{DIA_VENCIMENTO}}',
  
  // Dados da Atividade
  '{{DESCRICAO_ATIVIDADE}}',
  '{{CARGO_FUNCAO}}',
  '{{GRAU_RISCO}}',
  '{{TEMPO_CONTRATO}}',
  
  // Benefícios
  '{{VEICULO}}',
  '{{CELULAR}}',
  '{{ALOJAMENTO}}',
  '{{FOLGA_CAMPO}}',
  '{{PERIODO_FERIAS}}',
  '{{QUANTIDADE_DIAS_FERIAS}}',
  
  // Dados Bancários
  '{{BANCO}}',
  '{{AGENCIA}}',
  '{{CONTA}}',
  '{{TIPO_CONTA}}',
  '{{CHAVE_PIX}}',
  
  // Dados de Emissão
  '{{DATA_EMISSAO}}',
  '{{DATA_EMISSAO_EXTENSO}}',
];

// Categorias de códigos para melhor organização
export const CATEGORIAS_CODIGOS = {
  'Dados do Prestador': [
    '{{PRESTADOR_RAZAO_SOCIAL}}',
    '{{PRESTADOR_NOME_COMPLETO}}',
    '{{PRESTADOR_CNPJ}}',
    '{{PRESTADOR_CPF}}',
    '{{PRESTADOR_INSCRICAO_ESTADUAL}}',
    '{{PRESTADOR_INSCRICAO_MUNICIPAL}}',
    '{{PRESTADOR_ENDERECO}}',
    '{{PRESTADOR_CEP}}',
    '{{PRESTADOR_CIDADE}}',
    '{{PRESTADOR_ESTADO}}',
    '{{PRESTADOR_TELEFONE}}',
    '{{PRESTADOR_EMAIL}}',
  ],
  'Dados Financeiros': [
    '{{VALOR_PRESTACAO_SERVICO}}',
    '{{VALOR_PRESTACAO_SERVICO_EXTENSO}}',
    '{{AJUDA_CUSTO}}',
    '{{AJUDA_CUSTO_EXTENSO}}',
    '{{AUXILIO_CONVENIO_MEDICO}}',
    '{{AUXILIO_ALUGUEL}}',
    '{{VALE_REFEICAO}}',
    '{{CAFE_MANHA}}',
    '{{CAFE_TARDE}}',
    '{{ALMOCO}}',
    '{{VALOR_TOTAL_MENSAL}}',
    '{{VALOR_TOTAL_MENSAL_EXTENSO}}',
  ],
  'Dados do Contrato': [
    '{{NUMERO_CONTRATO}}',
    '{{DATA_INICIO_CONTRATO}}',
    '{{DATA_FIM_CONTRATO}}',
    '{{PRAZO_CONTRATO}}',
    '{{FORMA_PAGAMENTO}}',
    '{{DIA_VENCIMENTO}}',
  ],
  'Dados da Atividade': [
    '{{DESCRICAO_ATIVIDADE}}',
    '{{CARGO_FUNCAO}}',
    '{{GRAU_RISCO}}',
    '{{TEMPO_CONTRATO}}',
  ],
  'Benefícios': [
    '{{VEICULO}}',
    '{{CELULAR}}',
    '{{ALOJAMENTO}}',
    '{{FOLGA_CAMPO}}',
    '{{PERIODO_FERIAS}}',
    '{{QUANTIDADE_DIAS_FERIAS}}',
  ],
  'Dados Bancários': [
    '{{BANCO}}',
    '{{AGENCIA}}',
    '{{CONTA}}',
    '{{TIPO_CONTA}}',
    '{{CHAVE_PIX}}',
  ],
  'Dados de Emissão': [
    '{{DATA_EMISSAO}}',
    '{{DATA_EMISSAO_EXTENSO}}',
  ],
};

// Função para converter número para extenso (simplificada)
export function valorPorExtenso(valor: number): string {
  // Implementação simplificada - pode ser expandida conforme necessário
  const partes = valor.toFixed(2).split('.');
  const reais = parseInt(partes[0]);
  const centavos = parseInt(partes[1]);
  
  // TODO: Implementar conversão completa por extenso
  return `${reais} reais e ${centavos} centavos`;
}

// Função para formatar data por extenso
export function dataPorExtenso(data: string): string {
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  
  const d = new Date(data);
  const dia = d.getDate();
  const mes = meses[d.getMonth()];
  const ano = d.getFullYear();
  
  return `${dia} de ${mes} de ${ano}`;
}

// Função principal para substituir códigos
export function substituirCodigosContrato(
  template: string,
  prestador: PrestadorPJ,
  dadosAdicionais: {
    numeroContrato?: string;
    dataInicio?: string;
    dataFim?: string;
    formaPagamento?: string;
    diaVencimento?: string;
    observacoes?: string;
  } = {}
): string {
  let conteudo = template;
  
  // Calcular valor total mensal
  const valorTotal = (prestador.valorPrestacaoServico || 0) +
    (prestador.ajudaCusto || 0) +
    (prestador.auxilioConvenioMedico || 0) +
    (prestador.ajudaAluguel || 0) +
    (prestador.valeRefeicao || 0) +
    (prestador.cafeManha || 0) +
    (prestador.cafeTarde || 0) +
    (prestador.almoco || 0);
  
  // Data de emissão
  const dataEmissao = new Date().toLocaleDateString('pt-BR');
  
  // Substituições
  const substituicoes: Record<string, string> = {
    '{{PRESTADOR_RAZAO_SOCIAL}}': prestador.razaoSocial || '',
    '{{PRESTADOR_NOME_COMPLETO}}': prestador.nomeCompleto || '',
    '{{PRESTADOR_CNPJ}}': prestador.cnpj || '',
    '{{PRESTADOR_CPF}}': prestador.cpf || '',
    '{{PRESTADOR_INSCRICAO_ESTADUAL}}': prestador.inscricaoEstadual || '',
    '{{PRESTADOR_INSCRICAO_MUNICIPAL}}': prestador.inscricaoMunicipal || '',
    '{{PRESTADOR_ENDERECO}}': prestador.endereco || '',
    '{{PRESTADOR_CEP}}': prestador.cep || '',
    '{{PRESTADOR_CIDADE}}': prestador.cidade || '',
    '{{PRESTADOR_ESTADO}}': prestador.estado || '',
    '{{PRESTADOR_TELEFONE}}': prestador.telefone || '',
    '{{PRESTADOR_EMAIL}}': prestador.email || '',
    
    '{{VALOR_PRESTACAO_SERVICO}}': (prestador.valorPrestacaoServico || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    '{{VALOR_PRESTACAO_SERVICO_EXTENSO}}': valorPorExtenso(prestador.valorPrestacaoServico || 0),
    '{{AJUDA_CUSTO}}': (prestador.ajudaCusto || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    '{{AJUDA_CUSTO_EXTENSO}}': valorPorExtenso(prestador.ajudaCusto || 0),
    '{{AUXILIO_CONVENIO_MEDICO}}': (prestador.auxilioConvenioMedico || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    '{{AUXILIO_ALUGUEL}}': (prestador.ajudaAluguel || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    '{{VALE_REFEICAO}}': (prestador.valeRefeicao || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    '{{CAFE_MANHA}}': (prestador.cafeManha || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    '{{CAFE_TARDE}}': (prestador.cafeTarde || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    '{{ALMOCO}}': (prestador.almoco || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    '{{VALOR_TOTAL_MENSAL}}': valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    '{{VALOR_TOTAL_MENSAL_EXTENSO}}': valorPorExtenso(valorTotal),
    
    '{{NUMERO_CONTRATO}}': dadosAdicionais.numeroContrato || '',
    '{{DATA_INICIO_CONTRATO}}': dadosAdicionais.dataInicio ? new Date(dadosAdicionais.dataInicio).toLocaleDateString('pt-BR') : '',
    '{{DATA_FIM_CONTRATO}}': dadosAdicionais.dataFim ? new Date(dadosAdicionais.dataFim).toLocaleDateString('pt-BR') : '',
    '{{PRAZO_CONTRATO}}': '', // Calculado a partir das datas
    '{{FORMA_PAGAMENTO}}': dadosAdicionais.formaPagamento || '',
    '{{DIA_VENCIMENTO}}': dadosAdicionais.diaVencimento || '',
    
    '{{DESCRICAO_ATIVIDADE}}': prestador.descricaoAtividade || '',
    '{{CARGO_FUNCAO}}': prestador.descricaoAtividade || '',
    '{{GRAU_RISCO}}': prestador.grauDeRisco?.toString() || '',
    '{{TEMPO_CONTRATO}}': prestador.tempoContrato || '',
    
    '{{VEICULO}}': prestador.veiculo ? 'Sim' : 'Não',
    '{{CELULAR}}': prestador.celular ? 'Sim' : 'Não',
    '{{ALOJAMENTO}}': prestador.alojamento ? 'Sim' : 'Não',
    '{{FOLGA_CAMPO}}': prestador.folgaCampo || '',
    '{{PERIODO_FERIAS}}': prestador.periodoFerias || '',
    '{{QUANTIDADE_DIAS_FERIAS}}': prestador.quantidadeDiasFerias?.toString() || '',
    
    '{{BANCO}}': prestador.banco || '',
    '{{AGENCIA}}': prestador.agencia || '',
    '{{CONTA}}': prestador.conta || '',
    '{{TIPO_CONTA}}': prestador.tipoConta || '',
    '{{CHAVE_PIX}}': prestador.chavePix || '',
    
    '{{DATA_EMISSAO}}': dataEmissao,
    '{{DATA_EMISSAO_EXTENSO}}': dataPorExtenso(new Date().toISOString()),
  };
  
  // Aplicar todas as substituições
  Object.entries(substituicoes).forEach(([codigo, valor]) => {
    conteudo = conteudo.replace(new RegExp(codigo, 'g'), valor);
  });
  
  return conteudo;
}
