
export const calculateStatusAcao = (situacao: string, prazoCorrecao: string): string => {
  console.log('🔍 Calculando status para situacao:', situacao, 'prazo:', prazoCorrecao);
  
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
      
      console.log('📅 Comparando datas - Prazo:', prazoDate, 'Atual:', currentDate);
      
      if (prazoDate < currentDate) {
        console.log('⚠️ Prazo vencido - Status: PENDENTE');
        return "PENDENTE";
      } else {
        console.log('✅ Prazo ok - Status: EM ANDAMENTO');
        return "EM ANDAMENTO";
      }
    }
    console.log('❌ Sem prazo - Status: PENDENTE');
    return "PENDENTE";
  }
  
  console.log('🔄 Status padrão para situacao:', situacao);
  return situacao || "PENDENTE";
};
