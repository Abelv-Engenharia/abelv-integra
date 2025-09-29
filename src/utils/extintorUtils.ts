import { supabase } from "@/integrations/supabase/client";

/**
 * Mapeia o tipo de extintor para sua abreviação
 */
const tipoParaAbreviacao: Record<string, string> = {
  "agua": "AG",
  "po-quimico": "PQ",
  "co2": "CO2",
  "espuma": "ESP",
  "gas-inerte": "GI",
};

/**
 * Gera um código único para o extintor no formato:
 * EXT-{CCA_CODIGO}-{TIPO_ABREV}-{CAPACIDADE}-{SEQUENCIAL}
 * 
 * Exemplo: EXT-CCA01-PQ-6KG-01
 * 
 * @param ccaCodigo - Código do CCA (ex: "CCA-01" -> "CCA01")
 * @param tipo - Tipo do extintor (agua, po-quimico, co2, espuma, gas-inerte)
 * @param capacidade - Capacidade do extintor (ex: "6kg", "4L")
 * @returns Código único gerado
 */
export async function gerarCodigoExtintor(
  ccaCodigo: string,
  tipo: string,
  capacidade: string
): Promise<string> {
  // Remover hífens e espaços do código do CCA
  const ccaFormatado = ccaCodigo.replace(/[-\s]/g, "").toUpperCase();
  
  // Obter abreviação do tipo
  const tipoAbrev = tipoParaAbreviacao[tipo] || tipo.substring(0, 3).toUpperCase();
  
  // Formatar capacidade (remover espaços)
  const capacidadeFormatada = capacidade.replace(/\s/g, "").toUpperCase();
  
  // Construir prefixo base
  const prefixoBase = `EXT-${ccaFormatado}-${tipoAbrev}-${capacidadeFormatada}`;
  
  // Buscar códigos existentes com este prefixo
  const { data: extintoresExistentes, error } = await supabase
    .from("extintores")
    .select("codigo")
    .like("codigo", `${prefixoBase}-%`)
    .order("codigo", { ascending: false });
  
  if (error) {
    console.error("Erro ao buscar extintores existentes:", error);
    throw error;
  }
  
  // Determinar próximo número sequencial
  let proximoNumero = 1;
  
  if (extintoresExistentes && extintoresExistentes.length > 0) {
    // Extrair números sequenciais dos códigos existentes
    const numeros = extintoresExistentes
      .map(e => {
        const match = e.codigo.match(/-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => n > 0);
    
    if (numeros.length > 0) {
      proximoNumero = Math.max(...numeros) + 1;
    }
  }
  
  // Formatar número com 2 dígitos
  const numeroFormatado = proximoNumero.toString().padStart(2, "0");
  
  // Retornar código completo
  return `${prefixoBase}-${numeroFormatado}`;
}

/**
 * Formata o tipo de extintor para exibição
 */
export function formatarTipoExtintor(tipo: string): string {
  const tipos: Record<string, string> = {
    "agua": "Água",
    "po-quimico": "Pó Químico",
    "co2": "CO2",
    "espuma": "Espuma",
    "gas-inerte": "Gás Inerte",
  };
  
  return tipos[tipo] || tipo;
}

/**
 * Retorna a classe CSS para o badge de status do extintor
 */
export function getStatusExtintorBadgeClass(dataVencimento: string | null): string {
  if (!dataVencimento) return "bg-muted";
  
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  const diasAteVencimento = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diasAteVencimento < 0) return "bg-destructive";
  if (diasAteVencimento <= 30) return "bg-warning";
  return "bg-success";
}

/**
 * Retorna o texto do status do extintor baseado na data de vencimento
 */
export function getStatusExtintorTexto(dataVencimento: string | null): string {
  if (!dataVencimento) return "Sem Data";
  
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  const diasAteVencimento = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diasAteVencimento < 0) return "Vencido";
  if (diasAteVencimento <= 30) return "Próximo ao Vencimento";
  return "Ativo";
}
