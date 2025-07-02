
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

export async function fetchTaxaFrequenciaAcCpdPorMes(ano: number, ccaIds?: number[]) {
  try {
    console.log('Buscando dados de taxa de frequência AC CPD para o ano:', ano);
    
    // Buscar ocorrências AC CPD por mês
    let ocorrenciasQuery = supabase
      .from('ocorrencias')
      .select('mes, classificacao_ocorrencia')
      .eq('ano', ano)
      .eq('classificacao_ocorrencia', 'AC CPD - ACIDENTE COM PERDA DE DIAS');

    // Aplicar filtro por CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      const { data: ccasData } = await supabase
        .from('ccas')
        .select('nome')
        .in('id', ccaIds);
      
      if (ccasData && ccasData.length > 0) {
        const ccaNomes = ccasData.map(cca => cca.nome);
        ocorrenciasQuery = ocorrenciasQuery.in('cca', ccaNomes);
      }
    }

    const { data: ocorrencias } = await ocorrenciasQuery;

    // Buscar horas trabalhadas por mês
    let horasQuery = supabase
      .from('horas_trabalhadas')
      .select('mes, horas_trabalhadas')
      .eq('ano', ano);

    if (ccaIds && ccaIds.length > 0) {
      horasQuery = horasQuery.in('cca_id', ccaIds);
    }

    const { data: horas } = await horasQuery;

    // Agrupar dados por mês
    const dadosMensais = [];
    for (let mes = 1; mes <= 12; mes++) {
      const ocorrenciasMes = ocorrencias?.filter(o => o.mes === mes).length || 0;
      const horasMes = horas?.filter(h => h.mes === mes).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
      
      const taxaMensal = horasMes > 0 ? (ocorrenciasMes / horasMes) * 1000000 : 0;
      
      // Calcular taxa acumulada
      const ocorrenciasAcumuladas = ocorrencias?.filter(o => o.mes <= mes).length || 0;
      const horasAcumuladas = horas?.filter(h => h.mes <= mes).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
      const taxaAcumulada = horasAcumuladas > 0 ? (ocorrenciasAcumuladas / horasAcumuladas) * 1000000 : 0;

      dadosMensais.push({
        mes,
        mensal: Number(taxaMensal.toFixed(2)),
        acumulada: Number(taxaAcumulada.toFixed(2))
      });
    }

    return dadosMensais;
  } catch (error) {
    console.error('Erro ao buscar dados de taxa de frequência AC CPD:', error);
    return [];
  }
}

export async function fetchTaxaFrequenciaAcSpdPorMes(ano: number, ccaIds?: number[]) {
  try {
    console.log('Buscando dados de taxa de frequência AC SPD para o ano:', ano);
    
    // Buscar ocorrências AC SPD por mês
    let ocorrenciasQuery = supabase
      .from('ocorrencias')
      .select('mes, classificacao_ocorrencia')
      .eq('ano', ano)
      .in('classificacao_ocorrencia', [
        'AC SPD - ACIDENTE SEM PERDA DE DIAS',
        'AC SPD CRT - ACIDENTE SEM PERDA DE DIAS COM LIMITAÇÃO DE TAREFA'
      ]);

    // Aplicar filtro por CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      const { data: ccasData } = await supabase
        .from('ccas')
        .select('nome')
        .in('id', ccaIds);
      
      if (ccasData && ccasData.length > 0) {
        const ccaNomes = ccasData.map(cca => cca.nome);
        ocorrenciasQuery = ocorrenciasQuery.in('cca', ccaNomes);
      }
    }

    const { data: ocorrencias } = await ocorrenciasQuery;

    // Buscar horas trabalhadas por mês
    let horasQuery = supabase
      .from('horas_trabalhadas')
      .select('mes, horas_trabalhadas')
      .eq('ano', ano);

    if (ccaIds && ccaIds.length > 0) {
      horasQuery = horasQuery.in('cca_id', ccaIds);
    }

    const { data: horas } = await horasQuery;

    // Agrupar dados por mês
    const dadosMensais = [];
    for (let mes = 1; mes <= 12; mes++) {
      const ocorrenciasMes = ocorrencias?.filter(o => o.mes === mes).length || 0;
      const horasMes = horas?.filter(h => h.mes === mes).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
      
      const taxaMensal = horasMes > 0 ? (ocorrenciasMes / horasMes) * 1000000 : 0;
      
      // Calcular taxa acumulada
      const ocorrenciasAcumuladas = ocorrencias?.filter(o => o.mes <= mes).length || 0;
      const horasAcumuladas = horas?.filter(h => h.mes <= mes).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
      const taxaAcumulada = horasAcumuladas > 0 ? (ocorrenciasAcumuladas / horasAcumuladas) * 1000000 : 0;

      dadosMensais.push({
        mes,
        mensal: Number(taxaMensal.toFixed(2)),
        acumulada: Number(taxaAcumulada.toFixed(2))
      });
    }

    return dadosMensais;
  } catch (error) {
    console.error('Erro ao buscar dados de taxa de frequência AC SPD:', error);
    return [];
  }
}

export async function fetchTaxaGravidadePorMes(ano: number, ccaIds?: number[]) {
  try {
    console.log('Buscando dados de taxa de gravidade para o ano:', ano);
    
    // Buscar ocorrências com dias perdidos por mês
    let ocorrenciasQuery = supabase
      .from('ocorrencias')
      .select('mes, dias_perdidos, dias_debitados')
      .eq('ano', ano)
      .not('dias_perdidos', 'is', null);

    // Aplicar filtro por CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      const { data: ccasData } = await supabase
        .from('ccas')
        .select('nome')
        .in('id', ccaIds);
      
      if (ccasData && ccasData.length > 0) {
        const ccaNomes = ccasData.map(cca => cca.nome);
        ocorrenciasQuery = ocorrenciasQuery.in('cca', ccaNomes);
      }
    }

    const { data: ocorrencias } = await ocorrenciasQuery;

    // Buscar horas trabalhadas por mês
    let horasQuery = supabase
      .from('horas_trabalhadas')
      .select('mes, horas_trabalhadas')
      .eq('ano', ano);

    if (ccaIds && ccaIds.length > 0) {
      horasQuery = horasQuery.in('cca_id', ccaIds);
    }

    const { data: horas } = await horasQuery;

    // Agrupar dados por mês
    const dadosMensais = [];
    for (let mes = 1; mes <= 12; mes++) {
      const diasPerdidosMes = ocorrencias?.filter(o => o.mes === mes).reduce((sum, o) => sum + (o.dias_perdidos || 0) + (o.dias_debitados || 0), 0) || 0;
      const horasMes = horas?.filter(h => h.mes === mes).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
      
      const taxaMensal = horasMes > 0 ? (diasPerdidosMes / horasMes) * 1000000 : 0;
      
      // Calcular taxa acumulada
      const diasPerdidosAcumulados = ocorrencias?.filter(o => o.mes <= mes).reduce((sum, o) => sum + (o.dias_perdidos || 0) + (o.dias_debitados || 0), 0) || 0;
      const horasAcumuladas = horas?.filter(h => h.mes <= mes).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
      const taxaAcumulada = horasAcumuladas > 0 ? (diasPerdidosAcumulados / horasAcumuladas) * 1000000 : 0;

      dadosMensais.push({
        mes,
        mensal: Number(taxaMensal.toFixed(2)),
        acumulada: Number(taxaAcumulada.toFixed(2))
      });
    }

    return dadosMensais;
  } catch (error) {
    console.error('Erro ao buscar dados de taxa de gravidade:', error);
    return [];
  }
}

export async function fetchMetaIndicador(ano: number, campo: string) {
  try {
    console.log(`Buscando meta ${campo} para o ano:`, ano);
    
    const { data, error } = await supabase
      .from('metas_indicadores')
      .select(campo)
      .eq('ano', ano)
      .single();

    if (error) {
      console.warn(`Meta ${campo} não encontrada para o ano ${ano}:`, error);
      return 0;
    }

    return data?.[campo] || 0;
  } catch (error) {
    console.error(`Erro ao buscar meta ${campo}:`, error);
    return 0;
  }
}
