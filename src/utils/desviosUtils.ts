
export const calculateStatusAcao = (situacao: string, prazoCorrecao: string): string => {
  if (situacao === "TRATADO") {
    return "CONCLUÍDO";
  }
  
  if (situacao === "EM ANDAMENTO" || situacao === "EM TRATATIVA") {
    if (prazoCorrecao) {
      const prazoDate = new Date(prazoCorrecao);
      const currentDate = new Date();
      
      if (prazoDate > currentDate) {
        return "EM ANDAMENTO";
      } else {
        return "PENDENTE";
      }
    }
    return "PENDENTE";
  }
  
  return "";
};
