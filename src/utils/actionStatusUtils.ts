interface Acao {
  tratativa_aplicada: string;
  data_adequacao: Date | string | null;
  responsavel_acao: string;
  funcao_responsavel: string;
  situacao: string;
  status: string;
}

/**
 * Calcula o status dinâmico de uma ação baseado na data de adequação
 */
export const calcularStatusDinamico = (acao: Acao): { status: string; situacao: string } => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Considerar apenas a data, não o horário
  
  const statusUpper = acao.status?.toUpperCase() || '';
  const situacaoUpper = acao.situacao?.toUpperCase() || '';
  
  // Se já está concluída ou cancelada, manter como está
  if (['CONCLUÍDO', 'CONCLUIDO', 'CANCELADO'].includes(statusUpper) ||
      ['CONCLUÍDA', 'CONCLUIDA', 'CANCELADA'].includes(situacaoUpper)) {
    return {
      status: acao.status,
      situacao: acao.situacao
    };
  }
  
  // Se não tem data de adequação, manter status atual
  if (!acao.data_adequacao) {
    return {
      status: acao.status || 'Aberto',
      situacao: acao.situacao || 'Pendente'
    };
  }
  
  // Converter data de adequação para Date se for string
  const dataAdequacao = typeof acao.data_adequacao === 'string' 
    ? new Date(acao.data_adequacao) 
    : acao.data_adequacao;
  
  dataAdequacao.setHours(0, 0, 0, 0);
  
  // Se a data de adequação já passou e não está concluída
  if (dataAdequacao < hoje) {
    return {
      status: 'Atrasado',
      situacao: 'Pendente'
    };
  }
  
  // Se está próxima do vencimento (3 dias antes)
  const diasParaVencimento = Math.ceil((dataAdequacao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  if (diasParaVencimento <= 3 && diasParaVencimento >= 0) {
    return {
      status: acao.status === 'Em execução' ? 'Em execução' : 'Aberto',
      situacao: 'Próximo ao vencimento'
    };
  }
  
  // Manter status atual se não há alterações necessárias
  return {
    status: acao.status || 'Aberto',
    situacao: acao.situacao || 'Pendente'
  };
};

/**
 * Processa todas as ações de uma ocorrência para calcular status dinâmicos
 */
export const processarAcoesDinamicas = (acoes: Acao[]): Acao[] => {
  return acoes.map(acao => {
    const statusCalculado = calcularStatusDinamico(acao);
    return {
      ...acao,
      status: statusCalculado.status,
      situacao: statusCalculado.situacao
    };
  });
};

/**
 * Retorna a cor apropriada para o status da ação
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Concluído':
      return 'bg-green-100 text-green-800';
    case 'Em execução':
      return 'bg-blue-100 text-blue-800';
    case 'Atrasado':
      return 'bg-red-100 text-red-800';
    case 'Cancelado':
      return 'bg-gray-100 text-gray-800';
    case 'Aberto':
    default:
      return 'bg-orange-100 text-orange-800';
  }
};

/**
 * Retorna a cor apropriada para a situação da ação
 */
export const getSituacaoColor = (situacao: string): string => {
  switch (situacao) {
    case 'Concluída':
      return 'bg-green-100 text-green-800';
    case 'Em andamento':
      return 'bg-blue-100 text-blue-800';
    case 'Pendente':
      return 'bg-red-100 text-red-800';
    case 'Próximo ao vencimento':
      return 'bg-yellow-100 text-yellow-800';
    case 'Cancelada':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-orange-100 text-orange-800';
  }
};