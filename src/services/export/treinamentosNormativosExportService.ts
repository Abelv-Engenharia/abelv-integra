import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

interface ExportFilters {
  dataInicial: string;
  dataFinal: string;
  ccaId?: string;
}

export const exportTreinamentosNormativosToExcel = async (filters: ExportFilters) => {
  try {
    let query = supabase
      .from('treinamentos_normativos')
      .select(`
        *,
        funcionarios:funcionario_id(nome, matricula, funcao, cca_id)
      `)
      .gte('created_at', filters.dataInicial)
      .lte('created_at', filters.dataFinal + 'T23:59:59')
      .order('created_at', { ascending: false });

    if (filters.ccaId) {
      // Filtrar por CCA através do funcionário
      const { data: funcionarios } = await supabase
        .from('funcionarios')
        .select('id')
        .eq('cca_id', parseInt(filters.ccaId));
      
      if (funcionarios && funcionarios.length > 0) {
        const funcionarioIds = funcionarios.map(f => f.id);
        query = query.in('funcionario_id', funcionarioIds);
      } else {
        // Se não há funcionários no CCA, retorna vazio
        throw new Error('Nenhum funcionário encontrado para o CCA selecionado');
      }
    }

    const { data: treinamentos, error } = await query;

    if (error) {
      console.error('Erro ao buscar treinamentos normativos:', error);
      throw error;
    }

    if (!treinamentos || treinamentos.length === 0) {
      throw new Error('Nenhum treinamento normativo encontrado para o período selecionado');
    }

    // Preparar dados para o Excel
    const excelData = treinamentos.map(treinamento => ({
      'ID': treinamento.id,
      'Funcionário': treinamento.funcionarios?.nome || '',
      'Matrícula': treinamento.funcionarios?.matricula || '',
      'Função': treinamento.funcionarios?.funcao || '',
      'CCA ID': treinamento.funcionarios?.cca_id || '',
      'Tipo': treinamento.tipo,
      'Treinamento ID': treinamento.treinamento_id,
      'Data de Realização': treinamento.data_realizacao,
      'Data de Validade': treinamento.data_validade,
      'Status': treinamento.status,
      'Certificado URL': treinamento.certificado_url,
      'Arquivado': treinamento.arquivado ? 'Sim' : 'Não',
      'Data de Criação': treinamento.created_at,
      'Última Atualização': treinamento.updated_at
    }));

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar largura das colunas
    const wscols = [
      { wch: 36 }, // ID
      { wch: 25 }, // Funcionário
      { wch: 15 }, // Matrícula
      { wch: 20 }, // Função
      { wch: 10 }, // CCA ID
      { wch: 30 }, // Treinamento
      { wch: 15 }, // Validade (dias)
      { wch: 15 }, // Data de Realização
      { wch: 15 }, // Data de Validade
      { wch: 20 }, // Status
      { wch: 40 }, // Certificado URL
      { wch: 50 }, // Observações
      { wch: 10 }, // Arquivado
      { wch: 20 }, // Data de Criação
      { wch: 20 }  // Última Atualização
    ];
    ws['!cols'] = wscols;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Treinamentos Normativos');

    // Gerar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `treinamentos_normativos_${timestamp}.xlsx`;

    // Fazer download do arquivo
    XLSX.writeFile(wb, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Erro na exportação:', error);
    throw error;
  }
};