import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

interface DadosContrato {
  [key: string]: string | number | Date | null | undefined;
}

/**
 * Baixa o arquivo .docx do Supabase Storage
 */
export async function baixarModeloDocx(url: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro ao baixar modelo: ${response.statusText}`);
    }
    
    return await response.arrayBuffer();
  } catch (error) {
    console.error('Erro ao baixar modelo:', error);
    throw new Error('Não foi possível baixar o modelo do contrato');
  }
}

/**
 * Formata um valor Date para string no formato brasileiro
 */
function formatarData(data: Date | string | null | undefined): string {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  if (isNaN(dataObj.getTime())) return '';
  
  return dataObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formata um valor monetário para string no formato brasileiro
 */
function formatarValor(valor: number | string | null | undefined): string {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  
  const valorNum = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  if (isNaN(valorNum)) return 'R$ 0,00';
  
  return `R$ ${valorNum.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Prepara os dados para substituição, formatando valores conforme necessário
 */
function prepararDadosParaSubstituicao(dados: DadosContrato): Record<string, string> {
  const dadosFormatados: Record<string, string> = {};
  
  for (const [chave, valor] of Object.entries(dados)) {
    if (valor === null || valor === undefined) {
      dadosFormatados[chave] = '';
      continue;
    }
    
    // Formatar datas
    if (valor instanceof Date) {
      dadosFormatados[chave] = formatarData(valor);
      continue;
    }
    
    // Formatar valores monetários (chaves que contém 'valor' ou 'custo')
    if (typeof valor === 'number' && (chave.toLowerCase().includes('valor') || chave.toLowerCase().includes('custo'))) {
      dadosFormatados[chave] = formatarValor(valor);
      continue;
    }
    
    // Converter para string
    dadosFormatados[chave] = String(valor);
  }
  
  return dadosFormatados;
}

/**
 * Processa o modelo .docx substituindo os códigos pelos dados fornecidos
 */
export async function processarModeloDocx(
  arquivoBuffer: ArrayBuffer,
  dados: DadosContrato
): Promise<Blob> {
  try {
    // Preparar dados formatados
    const dadosFormatados = prepararDadosParaSubstituicao(dados);
    
    // Carregar o arquivo .docx
    const zip = new PizZip(arquivoBuffer);
    
    // Criar instância do docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    
    // Substituir os códigos
    doc.render(dadosFormatados);
    
    // Gerar o documento preenchido
    const blob = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    
    return blob;
  } catch (error) {
    console.error('Erro ao processar modelo:', error);
    
    // Verificar se é erro de tag não encontrada
    if (error instanceof Error && error.message.includes('tag')) {
      throw new Error('Erro ao preencher o modelo. Verifique se todos os códigos estão corretos.');
    }
    
    throw new Error('Não foi possível processar o modelo do contrato');
  }
}

/**
 * Gera e faz download do contrato preenchido
 */
export async function gerarContratoPreenchido(
  modeloUrl: string,
  dados: DadosContrato,
  nomeArquivo: string
): Promise<Blob> {
  try {
    // Baixar o modelo
    const arquivoBuffer = await baixarModeloDocx(modeloUrl);
    
    // Processar o modelo com os dados
    const blob = await processarModeloDocx(arquivoBuffer, dados);
    
    // Fazer download do arquivo
    saveAs(blob, nomeArquivo);
    
    return blob;
  } catch (error) {
    console.error('Erro ao gerar contrato:', error);
    throw error;
  }
}

/**
 * Converte Blob para File para upload
 */
export function blobParaFile(blob: Blob, nomeArquivo: string): File {
  return new File([blob], nomeArquivo, {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}
