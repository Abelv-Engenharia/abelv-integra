import { SolicitacaoServico, StatusSolicitacao } from "@/types/gestao-pessoas/solicitacao";

/**
 * Calcula o número de dias úteis entre duas datas
 * Ignora sábados e domingos (não considera feriados)
 */
export function calcularDiasUteis(dataInicio: Date, dataFim: Date): number {
  let diasUteis = 0;
  const atual = new Date(dataInicio);
  atual.setHours(0, 0, 0, 0);
  
  const fim = new Date(dataFim);
  fim.setHours(0, 0, 0, 0);
  
  while (atual < fim) {
    const diaSemana = atual.getDay();
    // 0 = Domingo, 6 = Sábado
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasUteis++;
    }
    atual.setDate(atual.getDate() + 1);
  }
  
  return diasUteis;
}

/**
 * Verifica e retorna o status correto da solicitação
 * Se estiver em andamento há mais de 3 dias úteis, retorna PENDENTE
 */
export function verificarEAtualizarStatus(
  solicitacao: SolicitacaoServico
): StatusSolicitacao {
  if (solicitacao.status !== StatusSolicitacao.EM_ANDAMENTO) {
    return solicitacao.status;
  }
  
  const hoje = new Date();
  const diasUteis = calcularDiasUteis(solicitacao.dataSolicitacao, hoje);
  
  console.log(`[VERIFICAÇÃO] Solicitação ${solicitacao.id}:`, {
    dataSolicitacao: solicitacao.dataSolicitacao.toLocaleDateString('pt-BR'),
    diasUteisDecorridos: diasUteis,
    statusAtual: solicitacao.status
  });
  
  if (diasUteis >= 3) {
    console.log(`[MOVIMENTAÇÃO] Solicitação ${solicitacao.id} será movida para PENDENTE`);
    return StatusSolicitacao.PENDENTE;
  }
  
  return StatusSolicitacao.EM_ANDAMENTO;
}

/**
 * Verifica se uma solicitação deve ser movida para pendente
 */
export function deveMoverParaPendente(solicitacao: SolicitacaoServico): boolean {
  if (solicitacao.status !== StatusSolicitacao.EM_ANDAMENTO) {
    return false;
  }
  
  const hoje = new Date();
  const diasUteis = calcularDiasUteis(solicitacao.dataSolicitacao, hoje);
  return diasUteis >= 3;
}
