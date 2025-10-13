import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mapeamento de CCAs para nomes de clientes
const ccaClienteMap: Record<string, string> = {
  '24021': 'Rousselot Canindé',
  '25028': 'Libbs Nova CAG'
};

// Função para obter o nome do cliente formatado (primeira letra maiúscula)
export function getClienteNome(cca: string | number, clienteOS?: string): string {
  const ccaStr = String(cca);
  
  // Verifica se existe mapeamento específico para o CCA
  if (ccaClienteMap[ccaStr]) {
    return ccaClienteMap[ccaStr].charAt(0).toUpperCase() + ccaClienteMap[ccaStr].slice(1).toLowerCase();
  }
  
  // Caso contrário, usa o nome do cliente da OS
  if (clienteOS) {
    return clienteOS.charAt(0).toUpperCase() + clienteOS.slice(1).toLowerCase();
  }
  
  return '';
}

// Função para formatar CCA com nome do cliente
export function formatarCCAComCliente(cca: string | number, clienteOS?: string): string {
  const ccaStr = String(cca || 'Sem CCA');
  const cliente = getClienteNome(cca, clienteOS);
  return cliente ? `${ccaStr} - ${cliente}` : ccaStr;
}
