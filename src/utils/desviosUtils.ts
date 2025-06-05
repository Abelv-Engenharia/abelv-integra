
export const calculateStatusAcao = (situacao: string, prazoCorrecao: string): string => {
  console.log('Calculando status da ação:', { situacao, prazoCorrecao });
  
  if (situacao === "TRATADO") {
    return "CONCLUÍDO";
  }
  
  if (situacao === "EM TRATATIVA") {
    if (prazoCorrecao) {
      const prazoDate = new Date(prazoCorrecao);
      const currentDate = new Date();
      
      // Remove a hora para comparar apenas as datas
      prazoDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      console.log('Comparando datas:', { prazoDate, currentDate });
      
      if (prazoDate >= currentDate) {
        return "EM ANDAMENTO";
      } else {
        return "PENDENTE";
      }
    }
    return "EM ANDAMENTO";
  }
  
  return "EM ANDAMENTO";
};
