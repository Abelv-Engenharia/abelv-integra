import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

interface ExportFilters {
  dataInicial: string;
  dataFinal: string;
  ccaId?: string;
}

export const exportTreinamentosExecucaoToExcel = async (filters: ExportFilters) => {
  try {
    let query = supabase
      .from('execucao_treinamentos')
      .select(`
        *,
        ccas:cca_id(nome, codigo),
        treinamentos:treinamento_id(nome),
        processo_treinamento:processo_treinamento_id(nome),
        tipo_treinamento:tipo_treinamento_id(nome)
      `)
      .gte('data', filters.dataInicial)
      .lte('data', filters.dataFinal)
      .order('data', { ascending: false });

    if (filters.ccaId) {
      query = query.eq('cca_id', parseInt(filters.ccaId));
    }

    const { data: execucoes, error } = await query;

    if (error) {
      console.error('Erro ao buscar execuções de treinamentos:', error);
      throw error;
    }

    if (!execucoes || execucoes.length === 0) {
      throw new Error('Nenhuma execução de treinamento encontrada para o período selecionado');
    }

    // Preparar dados para o Excel
    const excelData = execucoes.map(execucao => ({
      'ID': execucao.id,
      'Data': execucao.data,
      'Mês': execucao.mes,
      'Ano': execucao.ano,
      'CCA': execucao.ccas?.nome || execucao.cca || '',
      'Código CCA': execucao.ccas?.codigo || '',
      'Treinamento': execucao.treinamentos?.nome || execucao.treinamento_nome || '',
      'Tipo de Treinamento': execucao.tipo_treinamento || '',
      'Processo de Treinamento': execucao.processo_treinamento || '',
      'Carga Horária': execucao.carga_horaria,
      'Efetivo MOD': execucao.efetivo_mod,
      'Efetivo MOI': execucao.efetivo_moi,
      'Horas Totais': execucao.horas_totais,
      'Lista de Presença URL': execucao.lista_presenca_url,
      'Observações': execucao.observacoes,
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
      { wch: 30 }, // Treinamento
      { wch: 25 }, // Tipo de Treinamento
      { wch: 25 }, // Processo de Treinamento
      { wch: 12 }, // Carga Horária
      { wch: 12 }, // Efetivo MOD
      { wch: 12 }, // Efetivo MOI
      { wch: 12 }, // Horas Totais
      { wch: 40 }, // Lista de Presença URL
      { wch: 50 }, // Observações
      { wch: 20 }, // Data de Criação
      { wch: 20 }  // Última Atualização
    ];
    ws['!cols'] = wscols;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Execução Treinamentos');

    // Gerar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `execucao_treinamentos_${timestamp}.xlsx`;

    // Fazer download do arquivo
    XLSX.writeFile(wb, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Erro na exportação:', error);
    throw error;
  }
};