
import { supabase } from '@/integrations/supabase/client';

export async function fetchOcorrenciasStats(ccaIds?: number[]) {
  try {
    let ocorrenciasQuery = supabase
      .from('ocorrencias')
      .select('id, classificacao_ocorrencia, status');
    
    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      // Como a tabela ocorrencias tem o campo 'cca' como texto, 
      // precisamos buscar os códigos dos CCAs permitidos
      const { data: ccasData } = await supabase
        .from('ccas')
        .select('codigo')
        .in('id', ccaIds);
      
      if (ccasData && ccasData.length > 0) {
        const ccaCodigos = ccasData.map(cca => cca.codigo);
        ocorrenciasQuery = ocorrenciasQuery.in('cca', ccaCodigos);
      }
    }

    const { data: ocorrencias, error: ocorrenciasError } = await ocorrenciasQuery;

    if (ocorrenciasError) throw ocorrenciasError;

    console.log('Ocorrências filtradas por CCA:', ocorrencias);

    // Contar por tipo
    const totalOcorrencias = ocorrencias?.length || 0;
    const acCpd = ocorrencias?.filter(o => o.classificacao_ocorrencia === 'Acidente com Afastamento').length || 0;
    const acSpd = ocorrencias?.filter(o => o.classificacao_ocorrencia === 'Acidente sem Afastamento').length || 0;
    const inc = ocorrencias?.filter(o => o.classificacao_ocorrencia === 'Quase Acidente').length || 0;

    // Buscar ações relacionadas às ocorrências (se necessário)
    let acoesQuery = supabase
      .from('ocorrencias')
      .select('acoes');
    
    if (ccaIds && ccaIds.length > 0) {
      const { data: ccasData } = await supabase
        .from('ccas')
        .select('codigo')
        .in('id', ccaIds);
      
      if (ccasData && ccasData.length > 0) {
        const ccaCodigos = ccasData.map(cca => cca.codigo);
        acoesQuery = acoesQuery.in('cca', ccaCodigos);
      }
    }

    const { data: acoesData, error: acoesError } = await acoesQuery;

    if (acoesError) {
      console.error('Erro ao buscar ações:', acoesError);
    }

    // Processar ações
    let totalAcoes = 0;
    let acoesConcluidas = 0;
    let acoesAndamento = 0;
    let acoesPendentes = 0;

    if (acoesData) {
      acoesData.forEach((item: any) => {
        if (item.acoes && Array.isArray(item.acoes)) {
          item.acoes.forEach((acao: any) => {
            totalAcoes++;
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
    }

    return {
      totalOcorrencias,
      acCpd,
      acSpd,
      inc,
      totalAcoes,
      acoesConcluidas,
      acoesAndamento,
      acoesPendentes
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas das ocorrências:', error);
    return {
      totalOcorrencias: 0,
      acCpd: 0,
      acSpd: 0,
      inc: 0,
      totalAcoes: 0,
      acoesConcluidas: 0,
      acoesAndamento: 0,
      acoesPendentes: 0
    };
  }
}

export async function fetchTaxaFrequenciaAcCpdPorMes(ano: number, ccaIds?: number[]) {
  try {
    let ocorrenciasQuery = supabase
      .from('ocorrencias')
      .select('mes, classificacao_ocorrencia')
      .eq('ano', ano)
      .eq('classificacao_ocorrencia', 'Acidente com Afastamento');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      const { data: ccasData } = await supabase
        .from('ccas')
        .select('codigo')
        .in('id', ccaIds);
      
      if (ccasData && ccasData.length > 0) {
        const ccaCodigos = ccasData.map(cca => cca.codigo);
        ocorrenciasQuery = ocorrenciasQuery.in('cca', ccaCodigos);
      }
    }

    const { data: ocorrencias, error: ocorrenciasError } = await ocorrenciasQuery;
    if (ocorrenciasError) throw ocorrenciasError;

    // Buscar horas trabalhadas filtradas
    let hhtQuery = supabase
      .from('horas_trabalhadas')
      .select('mes, horas_trabalhadas')
      .eq('ano', ano);

    if (ccaIds && ccaIds.length > 0) {
      hhtQuery = hhtQuery.in('cca_id', ccaIds);
    }

    const { data: horasTrabalhadas, error: hhtError } = await hhtQuery;
    if (hhtError) throw hhtError;

    // Processar dados mensais
    const dadosMensais = [];
    for (let mes = 1; mes <= 12; mes++) {
      const ocorrenciasMes = ocorrencias?.filter(o => o.mes === mes).length || 0;
      const horasMes = horasTrabalhadas?.filter(h => h.mes === mes)
        .reduce((total, h) => total + (Number(h.horas_trabalhadas) || 0), 0) || 0;
      
      const horasAcumuladas = horasTrabalhadas?.filter(h => h.mes <= mes)
        .reduce((total, h) => total + (Number(h.horas_trabalhadas) || 0), 0) || 0;
      
      const ocorrenciasAcumuladas = ocorrencias?.filter(o => o.mes <= mes).length || 0;

      const taxaMensal = horasMes > 0 ? (ocorrenciasMes * 1000000) / horasMes : 0;
      const taxaAcumulada = horasAcumuladas > 0 ? (ocorrenciasAcumuladas * 1000000) / horasAcumuladas : 0;

      dadosMensais.push({
        mes,
        mensal: taxaMensal,
        acumulada: taxaAcumulada
      });
    }

    return dadosMensais;
  } catch (error) {
    console.error('Erro ao buscar taxa de frequência AC CPD:', error);
    return [];
  }
}

export async function fetchTaxaFrequenciaAcSpdPorMes(ano: number, ccaIds?: number[]) {
  try {
    let ocorrenciasQuery = supabase
      .from('ocorrencias')
      .select('mes, classificacao_ocorrencia')
      .eq('ano', ano)
      .eq('classificacao_ocorrencia', 'Acidente sem Afastamento');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      const { data: ccasData } = await supabase
        .from('ccas')
        .select('codigo')
        .in('id', ccaIds);
      
      if (ccasData && ccasData.length > 0) {
        const ccaCodigos = ccasData.map(cca => cca.codigo);
        ocorrenciasQuery = ocorrenciasQuery.in('cca', ccaCodigos);
      }
    }

    const { data: ocorrencias, error: ocorrenciasError } = await ocorrenciasQuery;
    if (ocorrenciasError) throw ocorrenciasError;

    // Buscar horas trabalhadas filtradas
    let hhtQuery = supabase
      .from('horas_trabalhadas')
      .select('mes, horas_trabalhadas')
      .eq('ano', ano);

    if (ccaIds && ccaIds.length > 0) {
      hhtQuery = hhtQuery.in('cca_id', ccaIds);
    }

    const { data: horasTrabalhadas, error: hhtError } = await hhtQuery;
    if (hhtError) throw hhtError;

    // Processar dados mensais
    const dadosMensais = [];
    for (let mes = 1; mes <= 12; mes++) {
      const ocorrenciasMes = ocorrencias?.filter(o => o.mes === mes).length || 0;
      const horasMes = horasTrabalhadas?.filter(h => h.mes === mes)
        .reduce((total, h) => total + (Number(h.horas_trabalhadas) || 0), 0) || 0;
      
      const horasAcumuladas = horasTrabalhadas?.filter(h => h.mes <= mes)
        .reduce((total, h) => total + (Number(h.horas_trabalhadas) || 0), 0) || 0;
      
      const ocorrenciasAcumuladas = ocorrencias?.filter(o => o.mes <= mes).length || 0;

      const taxaMensal = horasMes > 0 ? (ocorrenciasMes * 1000000) / horasMes : 0;
      const taxaAcumulada = horasAcumuladas > 0 ? (ocorrenciasAcumuladas * 1000000) / horasAcumuladas : 0;

      dadosMensais.push({
        mes,
        mensal: taxaMensal,
        acumulada: taxaAcumulada
      });
    }

    return dadosMensais;
  } catch (error) {
    console.error('Erro ao buscar taxa de frequência AC SPD:', error);
    return [];
  }
}

export async function fetchTaxaGravidadePorMes(ano: number, ccaIds?: number[]) {
  try {
    let ocorrenciasQuery = supabase
      .from('ocorrencias')
      .select('mes, dias_perdidos, classificacao_ocorrencia')
      .eq('ano', ano)
      .eq('classificacao_ocorrencia', 'Acidente com Afastamento');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      const { data: ccasData } = await supabase
        .from('ccas')
        .select('codigo')
        .in('id', ccaIds);
      
      if (ccasData && ccasData.length > 0) {
        const ccaCodigos = ccasData.map(cca => cca.codigo);
        ocorrenciasQuery = ocorrenciasQuery.in('cca', ccaCodigos);
      }
    }

    const { data: ocorrencias, error: ocorrenciasError } = await ocorrenciasQuery;
    if (ocorrenciasError) throw ocorrenciasError;

    // Buscar horas trabalhadas filtradas
    let hhtQuery = supabase
      .from('horas_trabalhadas')
      .select('mes, horas_trabalhadas')
      .eq('ano', ano);

    if (ccaIds && ccaIds.length > 0) {
      hhtQuery = hhtQuery.in('cca_id', ccaIds);
    }

    const { data: horasTrabalhadas, error: hhtError } = await hhtQuery;
    if (hhtError) throw hhtError;

    // Processar dados mensais
    const dadosMensais = [];
    for (let mes = 1; mes <= 12; mes++) {
      const ocorrenciasMes = ocorrencias?.filter(o => o.mes === mes) || [];
      const diasPerdidosMes = ocorrenciasMes.reduce((total, o) => total + (Number(o.dias_perdidos) || 0), 0);
      
      const horasMes = horasTrabalhadas?.filter(h => h.mes === mes)
        .reduce((total, h) => total + (Number(h.horas_trabalhadas) || 0), 0) || 0;
      
      const horasAcumuladas = horasTrabalhadas?.filter(h => h.mes <= mes)
        .reduce((total, h) => total + (Number(h.horas_trabalhadas) || 0), 0) || 0;
      
      const ocorrenciasAcumuladas = ocorrencias?.filter(o => o.mes <= mes) || [];
      const diasPerdidosAcumulados = ocorrenciasAcumuladas.reduce((total, o) => total + (Number(o.dias_perdidos) || 0), 0);

      const taxaMensal = horasMes > 0 ? (diasPerdidosMes * 1000000) / horasMes : 0;
      const taxaAcumulada = horasAcumuladas > 0 ? (diasPerdidosAcumulados * 1000000) / horasAcumuladas : 0;

      dadosMensais.push({
        mes,
        mensal: taxaMensal,
        acumulada: taxaAcumulada
      });
    }

    return dadosMensais;
  } catch (error) {
    console.error('Erro ao buscar taxa de gravidade:', error);
    return [];
  }
}

export async function fetchMetaIndicador(ano: number, tipoMeta: string) {
  try {
    const { data, error } = await supabase
      .from('metas_indicadores')
      .select(tipoMeta)
      .eq('ano', ano)
      .single();

    if (error) {
      console.log('Meta não encontrada para o ano:', ano);
      return 0;
    }

    return Number(data?.[tipoMeta]) || 0;
  } catch (error) {
    console.error('Erro ao buscar meta do indicador:', error);
    return 0;
  }
}
