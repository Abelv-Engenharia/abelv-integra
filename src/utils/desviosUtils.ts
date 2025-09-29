
export const calculateStatusAcao = (situacao: string, prazoCorrecao: string): string => {
  console.log('🔍 Calculando status para situacao:', situacao, 'prazo:', prazoCorrecao);
  
  // Agora a situacao já vem padronizada pelo trigger: CONCLUÍDO, EM ANDAMENTO, PENDENTE
  if (situacao === "CONCLUÍDO") {
    return "CONCLUÍDO";
  }
  
  if (situacao === "EM ANDAMENTO") {
    return "EM ANDAMENTO";
  }
  
  if (situacao === "PENDENTE") {
    return "PENDENTE";
  }
  
  // Fallback para casos legacy (não deveria acontecer com o trigger ativo)
  if (situacao === "TRATADO") {
    return "CONCLUÍDO";
  }
  
  if (situacao === "EM TRATATIVA") {
    if (prazoCorrecao) {
      const prazoDate = new Date(prazoCorrecao);
      const currentDate = new Date();
      
      prazoDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      if (prazoDate < currentDate) {
        return "PENDENTE";
      } else {
        return "EM ANDAMENTO";
      }
    }
    return "PENDENTE";
  }
  
  console.log('🔄 Status padrão para situacao:', situacao);
  return situacao || "PENDENTE";
};
