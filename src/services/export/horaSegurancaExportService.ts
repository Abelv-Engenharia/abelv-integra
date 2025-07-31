import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

interface ExportFilters {
  dataInicial: string;
  dataFinal: string;
  ccaId?: string;
}

export const exportHoraSegurancaToExcel = async (filters: ExportFilters) => {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select(`
        *,
        ccas:cca_id(nome, codigo)
      `)
      .gte('data', filters.dataInicial)
      .lte('data', filters.dataFinal)
      .order('data', { ascending: false });

    if (filters.ccaId) {
      query = query.eq('cca_id', parseInt(filters.ccaId));
    }

    const { data: execucoes, error } = await query;

    if (error) {
      console.error('Erro ao buscar execuções HSA:', error);
      throw error;
    }

    if (!execucoes || execucoes.length === 0) {
      throw new Error('Nenhuma execução de Hora da Segurança encontrada para o período selecionado');
    }

    // Preparar dados para o Excel
    const excelData = execucoes.map(execucao => ({
      'ID': execucao.id,
      'Data': execucao.data,
      'Mês': execucao.mes,
      'Ano': execucao.ano,
      'CCA': execucao.ccas?.nome || '',
      'Código CCA': execucao.ccas?.codigo || '',
      'Responsável pela Inspeção': execucao.responsavel_inspecao,
      'Função': execucao.funcao,
      'Inspeção Programada': execucao.inspecao_programada,
      'Desvios Identificados': execucao.desvios_identificados,
      'Status': execucao.status,
      'Observação': execucao.observacao,
      'Relatório URL': execucao.relatorio_url,
      'Data de Criação': execucao.created_at,
      'Última Atualização': execucao.updated_at
    }));

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar largura das colunas
    const wscols = [
      { wch: 36 }, // ID
      { wch: 12 }, // Data
      { wch: 8 },  // Mês
      { wch: 8 },  // Ano
      { wch: 20 }, // CCA
      { wch: 12 }, // Código CCA
      { wch: 30 }, // Responsável pela Inspeção
      { wch: 20 }, // Função
      { wch: 20 }, // Inspeção Programada
      { wch: 18 }, // Desvios Identificados
      { wch: 15 }, // Status
      { wch: 50 }, // Observação
      { wch: 40 }, // Relatório URL
      { wch: 20 }, // Data de Criação
      { wch: 20 }  // Última Atualização
    ];
    ws['!cols'] = wscols;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Hora da Segurança');

    // Gerar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `hora_seguranca_${timestamp}.xlsx`;

    // Fazer download do arquivo
    XLSX.writeFile(wb, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Erro na exportação:', error);
    throw error;
  }
};