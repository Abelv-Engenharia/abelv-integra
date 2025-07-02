
import { supabase } from '@/integrations/supabase/client';

export async function fetchOcorrenciasStats(ccaIds?: number[]) {
  try {
    console.log('Buscando estatísticas de ocorrências...');
    
    let query = supabase
      .from('ocorrencias')
      .select('classificacao_ocorrencia, dias_perdidos, dias_debitados, acoes');

    // Aplicar filtro por CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      // Como não temos cca_id na tabela ocorrencias, vamos filtrar pelo campo 'cca'
      const { data: ccasData } = await supabase
        .from('ccas')
        .select('nome')
        .in('id', ccaIds);
      
      if (ccasData && ccasData.length > 0) {
        const ccaNomes = ccasData.map(cca => cca.nome);
        query = query.in('cca', ccaNomes);
      }
    }

    const { data: ocorrencias, error } = await query;

    if (error) throw error;

    console.log('Ocorrências carregadas:', ocorrencias);

    // Classificar ocorrências por tipo
    const ocorrenciasComPerdaDias = ocorrencias?.filter(o => 
      o.classificacao_ocorrencia === 'AC CPD - ACIDENTE COM PERDA DE DIAS'
    ).length || 0;

    const ocorrenciasSemPerdaDias = ocorrencias?.filter(o => 
      o.classificacao_ocorrencia === 'AC SPD - ACIDENTE SEM PERDA DE DIAS' ||
      o.classificacao_ocorrencia === 'AC SPD CRT - ACIDENTE SEM PERDA DE DIAS COM LIMITAÇÃO DE TAREFA'
    ).length || 0;

    const incidentes = ocorrencias?.filter(o => 
      o.classificacao_ocorrencia === 'INC AMB - INCIDENTE AMBIENTAL' ||
      o.classificacao_ocorrencia === 'INC DM - INCIDENTE COM DANOS MATERIAIS' ||
      o.classificacao_ocorrencia === 'INC SDM - INCIDENTE SEM DANOS MATERIAIS'
    ).length || 0;

    const desviosAltoPotencial = ocorrencias?.filter(o => 
      o.classificacao_ocorrencia === 'DAP - DESVIO DE ALTO POTENCIAL'
    ).length || 0;

    // Calcular dias perdidos e debitados
    const totalDiasPerdidos = ocorrencias?.reduce((sum, o) => sum + (o.dias_perdidos || 0), 0) || 0;
    const totalDiasDebitados = ocorrencias?.reduce((sum, o) => sum + (o.dias_debitados || 0), 0) || 0;

    // Calcular estatísticas de ações
    let totalAcoes = 0;
    let acoesConcluidas = 0;
    let acoesAndamento = 0;
    let acoesPendentes = 0;

    ocorrencias?.forEach(ocorrencia => {
      if (ocorrencia.acoes && Array.isArray(ocorrencia.acoes)) {
        const acoes = ocorrencia.acoes;
        totalAcoes += acoes.length;
        
        acoes.forEach((acao: any) => {
          if (acao.status === 'Concluída') {
            acoesConcluidas++;
          } else if (acao.status === 'Em andamento') {
            acoesAndamento++;
          } else {
            acoesPendentes++;
          }
        });
      }
    });

    return {
      ocorrenciasComPerdaDias,
      ocorrenciasSemPerdaDias,
      incidentes,
      desviosAltoPotencial,
      totalDiasPerdidos,
      totalDiasDebitados,
      totalAcoes,
      acoesConcluidas,
      acoesAndamento,
      acoesPendentes
    };
  } catch (error) {
    console.error('Erro ao carregar estatísticas de ocorrências:', error);
    return {
      ocorrenciasComPerdaDias: 0,
      ocorrenciasSemPerdaDias: 0,
      incidentes: 0,
      desviosAltoPotencial: 0,
      totalDiasPerdidos: 0,
      totalDiasDebitados: 0,
      totalAcoes: 0,
      acoesConcluidas: 0,
      acoesAndamento: 0,
      acoesPendentes: 0
    };
  }
}
