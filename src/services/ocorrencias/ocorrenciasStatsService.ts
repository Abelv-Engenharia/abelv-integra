import { supabase } from '@/integrations/supabase/client';

export async function fetchOcorrenciasStats(ccaIds?: number[], year?: string, month?: string) {
  try {
    console.log('Buscando estatísticas de ocorrências...');
    
    // Construir query base
    let query = supabase
      .from('ocorrencias')
      .select('classificacao_ocorrencia_codigo, dias_perdidos, dias_debitados, status');

    // Aplicar filtro por CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      const ccaIdsAsString = ccaIds.map(id => id.toString());
      query = query.in('cca', ccaIdsAsString);
    }

    // Aplicar filtro de ano se fornecido
    if (year && year !== 'todos') {
      query = query.eq('ano', parseInt(year));
    }

    // Aplicar filtro de mês se fornecido
    if (month && month !== 'todos') {
      query = query.eq('mes', parseInt(month));
    }

    const { data: ocorrencias, error } = await query;

    if (error) throw error;

    console.log('Ocorrências carregadas:', ocorrencias);

    // Classificar ocorrências por tipo usando classificacao_ocorrencia_codigo
    const ocorrenciasComPerdaDias = ocorrencias?.filter(o => 
      o.classificacao_ocorrencia_codigo === 'AC CPD'
    ).length || 0;

    const ocorrenciasSemPerdaDias = ocorrencias?.filter(o => 
      o.classificacao_ocorrencia_codigo === 'AC SPD' ||
      o.classificacao_ocorrencia_codigo === 'AC SPD CRT'
    ).length || 0;

    const incidentes = ocorrencias?.filter(o => 
      o.classificacao_ocorrencia_codigo === 'INC DM' ||
      o.classificacao_ocorrencia_codigo === 'INC SDM' ||
      o.classificacao_ocorrencia_codigo === 'INC AMB'
    ).length || 0;

    const desviosAltoPotencial = ocorrencias?.filter(o => 
      o.classificacao_ocorrencia_codigo === 'DAP'
    ).length || 0;

    // Calcular dias perdidos e debitados
    const totalDiasPerdidos = ocorrencias?.reduce((sum, o) => sum + (o.dias_perdidos || 0), 0) || 0;
    const totalDiasDebitados = ocorrencias?.reduce((sum, o) => sum + (o.dias_debitados || 0), 0) || 0;

    // Calcular estatísticas de status das ocorrências
    const ocorrenciasConcluidas = ocorrencias?.filter(o => 
      o.status === 'Concluído' || o.status === 'Concluída' || o.status === 'Fechada' || o.status === 'Fechado'
    ).length || 0;

    const ocorrenciasPendentes = ocorrencias?.filter(o => 
      o.status === 'Aberta' || o.status === 'Aberto' || o.status === 'Em andamento' || o.status === 'Pendente'
    ).length || 0;

    return {
      ocorrenciasComPerdaDias,
      ocorrenciasSemPerdaDias,
      incidentes,
      desviosAltoPotencial,
      totalDiasPerdidos,
      totalDiasDebitados,
      ocorrenciasConcluidas,
      ocorrenciasPendentes
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
      ocorrenciasConcluidas: 0,
      ocorrenciasPendentes: 0
    };
  }
}

export async function fetchTaxaFrequenciaAcCpdPorMes(ano: number, ccaIds?: number[], mes?: number) {
  try {
    console.log('Buscando dados de taxa de frequência AC CPD para o ano:', ano, 'mês:', mes);
    
    // Buscar ocorrências AC CPD por mês
    let ocorrenciasQuery = supabase
      .from('ocorrencias')
      .select('mes, classificacao_ocorrencia_codigo')
      .eq('ano', ano)
      .eq('classificacao_ocorrencia_codigo', 'AC CPD');

    // Aplicar filtro por CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      // Para ocorrências, o campo CCA é string
      const ccaStringIds = ccaIds.map(id => id.toString());
      ocorrenciasQuery = ocorrenciasQuery.in('cca', ccaStringIds);
    }

    // Aplicar filtro de mês se fornecido
    if (mes) {
      ocorrenciasQuery = ocorrenciasQuery.eq('mes', mes);
    }

    const { data: ocorrencias } = await ocorrenciasQuery;

    // Buscar horas trabalhadas por mês
    let horasQuery = supabase
      .from('horas_trabalhadas')
      .select('mes, horas_trabalhadas')
      .eq('ano', ano);

    if (ccaIds && ccaIds.length > 0) {
      // Para horas_trabalhadas, o campo é cca_id como inteiro
      horasQuery = horasQuery.in('cca_id', ccaIds);
    }

    // Aplicar filtro de mês se fornecido
    if (mes) {
      horasQuery = horasQuery.eq('mes', mes);
    }

    const { data: horas } = await horasQuery;

    // Definir range de meses baseado no filtro
    const mesesParaProcessar = mes ? [mes] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // Agrupar dados por mês
    const dadosMensais = [];
    for (const mesAtual of mesesParaProcessar) {
      const ocorrenciasMes = ocorrencias?.filter(o => o.mes === mesAtual).length || 0;
      const horasMes = horas?.filter(h => h.mes === mesAtual).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
      
      const taxaMensal = horasMes > 0 ? (ocorrenciasMes / horasMes) * 1000000 : 0;
      
      // Calcular taxa acumulada (apenas se não for filtro por mês específico)
      let taxaAcumulada = 0;
      if (!mes) {
        const ocorrenciasAcumuladas = ocorrencias?.filter(o => o.mes <= mesAtual).length || 0;
        const horasAcumuladas = horas?.filter(h => h.mes <= mesAtual).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
        taxaAcumulada = horasAcumuladas > 0 ? (ocorrenciasAcumuladas / horasAcumuladas) * 1000000 : 0;
      } else {
        taxaAcumulada = taxaMensal; // Para mês específico, acumulada = mensal
      }

      dadosMensais.push({
        mes: mesAtual,
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

export async function fetchTaxaFrequenciaAcSpdPorMes(ano: number, ccaIds?: number[], mes?: number) {
  try {
    console.log('Buscando dados de taxa de frequência AC SPD para o ano:', ano, 'mês:', mes);
    
    // Buscar ocorrências AC SPD por mês
    let ocorrenciasQuery = supabase
      .from('ocorrencias')
      .select('mes, classificacao_ocorrencia_codigo')
      .eq('ano', ano)
      .in('classificacao_ocorrencia_codigo', [
        'AC SPD',
        'AC SPD CRT'
      ]);

    // Aplicar filtro por CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      const ccaStringIds = ccaIds.map(id => id.toString());
      ocorrenciasQuery = ocorrenciasQuery.in('cca', ccaStringIds);
    }

    // Aplicar filtro de mês se fornecido
    if (mes) {
      ocorrenciasQuery = ocorrenciasQuery.eq('mes', mes);
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

    // Aplicar filtro de mês se fornecido
    if (mes) {
      horasQuery = horasQuery.eq('mes', mes);
    }

    const { data: horas } = await horasQuery;

    // Definir range de meses baseado no filtro
    const mesesParaProcessar = mes ? [mes] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // Agrupar dados por mês
    const dadosMensais = [];
    for (const mesAtual of mesesParaProcessar) {
      const ocorrenciasMes = ocorrencias?.filter(o => o.mes === mesAtual).length || 0;
      const horasMes = horas?.filter(h => h.mes === mesAtual).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
      
      const taxaMensal = horasMes > 0 ? (ocorrenciasMes / horasMes) * 1000000 : 0;
      
      // Calcular taxa acumulada (apenas se não for filtro por mês específico)
      let taxaAcumulada = 0;
      if (!mes) {
        const ocorrenciasAcumuladas = ocorrencias?.filter(o => o.mes <= mesAtual).length || 0;
        const horasAcumuladas = horas?.filter(h => h.mes <= mesAtual).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
        taxaAcumulada = horasAcumuladas > 0 ? (ocorrenciasAcumuladas / horasAcumuladas) * 1000000 : 0;
      } else {
        taxaAcumulada = taxaMensal; // Para mês específico, acumulada = mensal
      }

      dadosMensais.push({
        mes: mesAtual,
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

export async function fetchTaxaGravidadePorMes(ano: number, ccaIds?: number[], mes?: number) {
  try {
    console.log('Buscando dados de taxa de gravidade para o ano:', ano, 'mês:', mes);
    
    // Buscar ocorrências com dias perdidos por mês
    let ocorrenciasQuery = supabase
      .from('ocorrencias')
      .select('mes, dias_perdidos, dias_debitados')
      .eq('ano', ano)
      .not('dias_perdidos', 'is', null);

    // Aplicar filtro por CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      const ccaStringIds = ccaIds.map(id => id.toString());
      ocorrenciasQuery = ocorrenciasQuery.in('cca', ccaStringIds);
    }

    // Aplicar filtro de mês se fornecido
    if (mes) {
      ocorrenciasQuery = ocorrenciasQuery.eq('mes', mes);
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

    // Aplicar filtro de mês se fornecido
    if (mes) {
      horasQuery = horasQuery.eq('mes', mes);
    }

    const { data: horas } = await horasQuery;

    // Definir range de meses baseado no filtro
    const mesesParaProcessar = mes ? [mes] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // Agrupar dados por mês
    const dadosMensais = [];
    for (const mesAtual of mesesParaProcessar) {
      const diasPerdidosMes = ocorrencias?.filter(o => o.mes === mesAtual).reduce((sum, o) => sum + (o.dias_perdidos || 0) + (o.dias_debitados || 0), 0) || 0;
      const horasMes = horas?.filter(h => h.mes === mesAtual).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
      
      const taxaMensal = horasMes > 0 ? (diasPerdidosMes / horasMes) * 1000000 : 0;
      
      // Calcular taxa acumulada (apenas se não for filtro por mês específico)
      let taxaAcumulada = 0;
      if (!mes) {
        const diasPerdidosAcumulados = ocorrencias?.filter(o => o.mes <= mesAtual).reduce((sum, o) => sum + (o.dias_perdidos || 0) + (o.dias_debitados || 0), 0) || 0;
        const horasAcumuladas = horas?.filter(h => h.mes <= mesAtual).reduce((sum, h) => sum + Number(h.horas_trabalhadas), 0) || 0;
        taxaAcumulada = horasAcumuladas > 0 ? (diasPerdidosAcumulados / horasAcumuladas) * 1000000 : 0;
      } else {
        taxaAcumulada = taxaMensal; // Para mês específico, acumulada = mensal
      }

      dadosMensais.push({
        mes: mesAtual,
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
