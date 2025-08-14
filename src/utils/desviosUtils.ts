
export const calculateStatusAcao = (situacao: string, prazoCorrecao: string): string => {
  if (situacao === "TRATADO") {
    return "CONCLUÍDO";
  }
  
  if (situacao === "EM ANDAMENTO" || situacao === "EM TRATATIVA") {
    if (prazoCorrecao) {
      const prazoDate = new Date(prazoCorrecao);
      const currentDate = new Date();
      
      // Resetar horas para comparar apenas datas
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
  
  return "";
};
