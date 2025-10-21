/**
 * Formata o número da solicitação para o formato amigável #0001
 */
export function formatarNumeroSolicitacao(numero?: number): string {
  if (!numero) return '#0000';
  return `#${String(numero).padStart(4, '0')}`;
}
