
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

interface ExportFilters {
  dataInicial?: string;
  dataFinal?: string;
  ccaId?: string;
  allowedCcaIds?: number[];
  empresa?: string;
  status?: string;
  classificacaoRisco?: string;
  searchTerm?: string;
}

export const exportDesviosToExcel = async (filters?: ExportFilters) => {
  try {
    // Buscar todos os desvios com joins para obter dados completos
    let query = supabase
      .from('desvios_completos')
      .select(`
        *,
        ccas:cca_id(nome, codigo),
        empresas:empresa_id(nome),
        disciplinas:disciplina_id(nome),
        processos:processo_id(nome),
        eventos_identificados:evento_identificado_id(nome),
        causas_provaveis:causa_provavel_id(nome),
        base_legal_opcoes:base_legal_opcao_id(nome),
        tipo_registros:tipo_registro_id(nome),
        profiles_responsavel:responsavel_id(nome),
        profiles_engenheiro:engenheiro_responsavel_id(nome),
        profiles_supervisor:supervisor_responsavel_id(nome),
        profiles_encarregado:encarregado_responsavel_id(nome)
      `)
      .limit(5000);

    // SEMPRE aplicar filtro de CCAs permitidos para segurança
    if (filters?.allowedCcaIds && filters.allowedCcaIds.length > 0) {
      query = query.in('cca_id', filters.allowedCcaIds);
    }

    // Aplicar filtros de data
    if (filters?.dataInicial && filters?.dataFinal) {
      query = query.gte('data_desvio', filters.dataInicial)
                  .lt('data_desvio', filters.dataFinal);
    }

    // Aplicar filtro de CCA específico (se dentro dos permitidos)
    if (filters?.ccaId) {
      query = query.eq('cca_id', parseInt(filters.ccaId));
    }

    // Aplicar outros filtros
    if (filters?.empresa) {
      query = query.eq('empresas.nome', filters.empresa);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.classificacaoRisco) {
      query = query.eq('classificacao_risco', filters.classificacaoRisco);
    }

    const { data: desvios, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar desvios:', error);
      throw error;
    }

    if (!desvios || desvios.length === 0) {
      throw new Error('Nenhum desvio encontrado para exportar');
    }

    // Aplicar filtro de busca por texto no lado cliente (se necessário)
    let filteredDesvios = desvios;
    if (filters?.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredDesvios = desvios.filter(desvio => 
        desvio.descricao_desvio?.toLowerCase().includes(searchTerm) ||
        desvio.responsavel_inspecao?.toLowerCase().includes(searchTerm) ||
        desvio.ccas?.nome?.toLowerCase().includes(searchTerm) ||
        desvio.empresas?.nome?.toLowerCase().includes(searchTerm)
      );
    }

    // Preparar dados para o Excel
    const excelData = filteredDesvios.map(desvio => ({
      'ID': desvio.id,
      'Data do Desvio': desvio.data_desvio,
      'Hora do Desvio': desvio.hora_desvio,
      'Responsável pela Inspeção': desvio.responsavel_inspecao,
      'Descrição do Desvio': desvio.descricao_desvio,
      'CCA': desvio.ccas?.nome || '',
      'Código CCA': desvio.ccas?.codigo || '',
      'Empresa': desvio.empresas?.nome || '',
      'Disciplina': desvio.disciplinas?.nome || '',
      'Processo': desvio.processos?.nome || '',
      'Evento Identificado': desvio.eventos_identificados?.nome || '',
      'Causa Provável': desvio.causas_provaveis?.nome || '',
      'Base Legal': desvio.base_legal_opcoes?.nome || '',
      'Tipo de Registro': desvio.tipo_registros?.nome || '',
      'Ação Imediata': desvio.acao_imediata,
      'Exposição': desvio.exposicao,
      'Controle': desvio.controle,
      'Detecção': desvio.deteccao,
      'Efeito da Falha': desvio.efeito_falha,
      'Impacto': desvio.impacto,
      'Probabilidade': desvio.probabilidade,
      'Severidade': desvio.severidade,
      'Classificação de Risco': desvio.classificacao_risco,
      'Status': desvio.status,
      'Situação': desvio.situacao,
      'Responsável': desvio.profiles_responsavel?.nome || '',
      'Engenheiro Responsável': desvio.profiles_engenheiro?.nome || '',
      'Supervisor Responsável': desvio.profiles_supervisor?.nome || '',
      'Encarregado Responsável': desvio.profiles_encarregado?.nome || '',
      'Prazo de Conclusão': desvio.prazo_conclusao,
      'Funcionários Envolvidos': Array.isArray(desvio.funcionarios_envolvidos) 
        ? desvio.funcionarios_envolvidos.map((f: any) => f.nome).join(', ')
        : '',
      'Ações': Array.isArray(desvio.acoes)
        ? desvio.acoes.map((a: any) => a.descricao).join('; ')
        : '',
      'URL da Imagem': desvio.imagem_url,
      'Data de Criação': desvio.created_at,
      'Última Atualização': desvio.updated_at
    }));

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar largura das colunas
    const wscols = [
      { wch: 36 }, // ID
      { wch: 12 }, // Data do Desvio
      { wch: 10 }, // Hora do Desvio
      { wch: 30 }, // Responsável pela Inspeção
      { wch: 50 }, // Descrição do Desvio
      { wch: 15 }, // CCA
      { wch: 12 }, // Código CCA
      { wch: 20 }, // Empresa
      { wch: 15 }, // Disciplina
      { wch: 20 }, // Processo
      { wch: 25 }, // Evento Identificado
      { wch: 25 }, // Causa Provável
      { wch: 20 }, // Base Legal
      { wch: 15 }, // Tipo de Registro
      { wch: 40 }, // Ação Imediata
      { wch: 10 }, // Exposição
      { wch: 10 }, // Controle
      { wch: 10 }, // Detecção
      { wch: 12 }, // Efeito da Falha
      { wch: 10 }, // Impacto
      { wch: 12 }, // Probabilidade
      { wch: 10 }, // Severidade
      { wch: 18 }, // Classificação de Risco
      { wch: 12 }, // Status
      { wch: 12 }, // Situação
      { wch: 25 }, // Responsável
      { wch: 25 }, // Engenheiro Responsável
      { wch: 25 }, // Supervisor Responsável
      { wch: 25 }, // Encarregado Responsável
      { wch: 15 }, // Prazo de Conclusão
      { wch: 40 }, // Funcionários Envolvidos
      { wch: 50 }, // Ações
      { wch: 40 }, // URL da Imagem
      { wch: 20 }, // Data de Criação
      { wch: 20 }  // Última Atualização
    ];
    ws['!cols'] = wscols;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Desvios');

    // Gerar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `desvios_completos_${timestamp}.xlsx`;

    // Fazer download do arquivo
    XLSX.writeFile(wb, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Erro na exportação:', error);
    throw error;
  }
};
