import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

interface ExportFilters {
  dataInicial: string;
  dataFinal: string;
  ccaId?: string;
}

export const exportOcorrenciasToExcel = async (filters: ExportFilters) => {
  try {
    let query = supabase
      .from('ocorrencias')
      .select('*')
      .gte('data', filters.dataInicial)
      .lte('data', filters.dataFinal + 'T23:59:59')
      .order('data', { ascending: false });

    if (filters.ccaId) {
      // Assumindo que há um campo cca_id ou similar na tabela ocorrencias
      // Se não houver, pode ser necessário filtrar por texto do campo 'cca'
      const { data: ccaInfo } = await supabase
        .from('ccas')
        .select('nome, codigo')
        .eq('id', parseInt(filters.ccaId))
        .single();

      if (ccaInfo) {
        query = query.or(`cca.ilike.%${ccaInfo.nome}%,cca.ilike.%${ccaInfo.codigo}%`);
      }
    }

    const { data: ocorrencias, error } = await query;

    if (error) {
      console.error('Erro ao buscar ocorrências:', error);
      throw error;
    }

    if (!ocorrencias || ocorrencias.length === 0) {
      throw new Error('Nenhuma ocorrência encontrada para o período selecionado');
    }

    // Preparar dados para o Excel
    const excelData = ocorrencias.map(ocorrencia => ({
      'ID': ocorrencia.id,
      'Data': ocorrencia.data,
      'Hora': ocorrencia.hora,
      'Mês': ocorrencia.mes,
      'Ano': ocorrencia.ano,
      'CCA': ocorrencia.cca,
      'Empresa': ocorrencia.empresa,
      'Disciplina': ocorrencia.disciplina,
      'Tipo de Ocorrência': ocorrencia.tipo_ocorrencia,
      'Tipo de Evento': ocorrencia.tipo_evento,
      'Classificação da Ocorrência': ocorrencia.classificacao_ocorrencia,
      'Classificação Código': ocorrencia.classificacao_ocorrencia_codigo,
      'Descrição': ocorrencia.descricao,
      'Descrição da Ocorrência': ocorrencia.descricao_ocorrencia,
      'Status': ocorrencia.status,
      'Impacto': ocorrencia.impacto,
      'Exposição': ocorrencia.exposicao,
      'Controle': ocorrencia.controle,
      'Detecção': ocorrencia.deteccao,
      'Efeito da Falha': ocorrencia.efeito_falha,
      'Probabilidade': ocorrencia.probabilidade,
      'Severidade': ocorrencia.severidade,
      'Classificação de Risco': ocorrencia.classificacao_risco,
      'Situação Geradora': ocorrencia.situacao_geradora,
      'Agente Causador': ocorrencia.agente_causador,
      'Parte do Corpo Atingida': ocorrencia.parte_corpo_atingida,
      'Lateralidade': ocorrencia.lateralidade,
      'Natureza da Lesão': ocorrencia.natureza_lesao,
      'CID': ocorrencia.cid,
      'Houve Afastamento': ocorrencia.houve_afastamento,
      'Dias Perdidos': ocorrencia.dias_perdidos,
      'Dias Debitados': ocorrencia.dias_debitados,
      'Número CAT': ocorrencia.numero_cat,
      'Arquivo CAT': ocorrencia.arquivo_cat,
      'Medidas Tomadas': ocorrencia.medidas_tomadas,
      'Investigação Realizada': ocorrencia.investigacao_realizada,
      'Relatório Análise': ocorrencia.relatorio_analise,
      'Informe Preliminar': ocorrencia.informe_preliminar,
      'Lições Aprendidas Enviada': ocorrencia.licoes_aprendidas_enviada,
      'Arquivo Lições Aprendidas': ocorrencia.arquivo_licoes_aprendidas,
      'Responsável': ocorrencia.responsavel_id,
      'Engenheiro Responsável': ocorrencia.engenheiro_responsavel,
      'Supervisor Responsável': ocorrencia.supervisor_responsavel,
      'Encarregado Responsável': ocorrencia.encarregado_responsavel,
      'Colaboradores Acidentados': Array.isArray(ocorrencia.colaboradores_acidentados) 
        ? ocorrencia.colaboradores_acidentados.map((c: any) => typeof c === 'object' ? c.nome : c).join(', ')
        : ocorrencia.colaboradores_acidentados,
      'Partes do Corpo Afetadas': Array.isArray(ocorrencia.partes_corpo_afetadas)
        ? ocorrencia.partes_corpo_afetadas.join(', ')
        : ocorrencia.partes_corpo_afetadas,
      'Ações': Array.isArray(ocorrencia.acoes)
        ? ocorrencia.acoes.map((a: any) => typeof a === 'object' ? a.descricao : a).join('; ')
        : ocorrencia.acoes,
      'Data de Criação': ocorrencia.created_at,
      'Última Atualização': ocorrencia.updated_at
    }));

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar largura das colunas (usando larguras otimizadas)
    const wscols = Array(Object.keys(excelData[0] || {}).length).fill({ wch: 20 });
    // Ajustar algumas colunas específicas
    wscols[0] = { wch: 36 }; // ID
    wscols[1] = { wch: 12 }; // Data
    wscols[2] = { wch: 10 }; // Hora
    
    ws['!cols'] = wscols;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Ocorrências');

    // Gerar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `ocorrencias_${timestamp}.xlsx`;

    // Fazer download do arquivo
    XLSX.writeFile(wb, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Erro na exportação:', error);
    throw error;
  }
};