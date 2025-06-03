
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, parseISO } from 'date-fns';

export interface OcorrenciasStats {
  totalOcorrencias: number;
  acCpd: number;
  acSpd: number;
  inc: number;
  totalAcoes: number;
  acoesConcluidas: number;
  acoesAndamento: number;
  acoesPendentes: number;
}

export async function fetchOcorrenciasStats(): Promise<OcorrenciasStats> {
  try {
    const { data: allOcorrencias, error: countError } = await supabase
      .from('ocorrencias')
      .select('id, tipo_ocorrencia, houve_afastamento, acoes');

    if (countError) throw countError;

    const totalOcorrencias = allOcorrencias ? allOcorrencias.length : 0;
    
    // Contar AC CPD (Acidentes com afastamento)
    const acCpd = allOcorrencias 
      ? allOcorrencias.filter(o => 
          o.tipo_ocorrencia === 'ACIDENTE' && o.houve_afastamento === 'SIM'
        ).length 
      : 0;

    // Contar AC SPD (Acidentes sem afastamento) 
    const acSpd = allOcorrencias 
      ? allOcorrencias.filter(o => 
          o.tipo_ocorrencia === 'ACIDENTE' && o.houve_afastamento === 'NÃO'
        ).length 
      : 0;

    // Contar INC (Incidentes)
    const inc = allOcorrencias 
      ? allOcorrencias.filter(o => o.tipo_ocorrencia === 'INCIDENTE').length 
      : 0;

    // Contar ações do plano de ação
    let totalAcoes = 0;
    let acoesConcluidas = 0;
    let acoesAndamento = 0;
    let acoesPendentes = 0;

    if (allOcorrencias) {
      allOcorrencias.forEach(ocorrencia => {
        if (Array.isArray(ocorrencia.acoes)) {
          totalAcoes += ocorrencia.acoes.length;
          
          ocorrencia.acoes.forEach((acao: any) => {
            switch (acao.status) {
              case 'CONCLUÍDO':
                acoesConcluidas++;
                break;
              case 'EM ANDAMENTO':
                acoesAndamento++;
                break;
              case 'PENDENTE':
                acoesPendentes++;
                break;
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
    console.error('Erro ao buscar estatísticas de ocorrências:', error);
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

// Função para calcular taxa de frequência conforme NBR 14280
export async function fetchTaxaFrequenciaAcCpd(): Promise<number> {
  try {
    const { data: ocorrencias } = await supabase
      .from('ocorrencias')
      .select('tipo_ocorrencia, houve_afastamento, data');
    
    const { data: hht } = await supabase
      .from('horas_trabalhadas')
      .select('horas_trabalhadas');

    const acCpd = ocorrencias 
      ? ocorrencias.filter(o => 
          o.tipo_ocorrencia === 'ACIDENTE' && o.houve_afastamento === 'SIM'
        ).length 
      : 0;

    const totalHHT = hht 
      ? hht.reduce((sum, h) => sum + (h.horas_trabalhadas || 0), 0)
      : 1;

    // Taxa de frequência = (número de acidentes * 1.000.000) / HHT
    return totalHHT > 0 ? (acCpd * 1000000) / totalHHT : 0;
  } catch (error) {
    console.error('Erro ao calcular taxa de frequência AC CPD:', error);
    return 0;
  }
}

export async function fetchTaxaFrequenciaAcSpd(): Promise<number> {
  try {
    const { data: ocorrencias } = await supabase
      .from('ocorrencias')
      .select('tipo_ocorrencia, houve_afastamento, data');
    
    const { data: hht } = await supabase
      .from('horas_trabalhadas')
      .select('horas_trabalhadas');

    const acSpd = ocorrencias 
      ? ocorrencias.filter(o => 
          o.tipo_ocorrencia === 'ACIDENTE' && o.houve_afastamento === 'NÃO'
        ).length 
      : 0;

    const totalHHT = hht 
      ? hht.reduce((sum, h) => sum + (h.horas_trabalhadas || 0), 0)
      : 1;

    return totalHHT > 0 ? (acSpd * 1000000) / totalHHT : 0;
  } catch (error) {
    console.error('Erro ao calcular taxa de frequência AC SPD:', error);
    return 0;
  }
}

export async function fetchTaxaGravidade(): Promise<number> {
  try {
    const { data: ocorrencias } = await supabase
      .from('ocorrencias')
      .select('tipo_ocorrencia, houve_afastamento, dias_perdidos, dias_debitados, data');
    
    const { data: hht } = await supabase
      .from('horas_trabalhadas')
      .select('horas_trabalhadas');

    const totalDiasPerdidos = ocorrencias 
      ? ocorrencias
          .filter(o => o.tipo_ocorrencia === 'ACIDENTE' && o.houve_afastamento === 'SIM')
          .reduce((sum, o) => sum + (o.dias_perdidos || 0) + (o.dias_debitados || 0), 0)
      : 0;

    const totalHHT = hht 
      ? hht.reduce((sum, h) => sum + (h.horas_trabalhadas || 0), 0)
      : 1;

    // Taxa de gravidade = (dias perdidos + dias debitados) * 1.000.000 / HHT
    return totalHHT > 0 ? (totalDiasPerdidos * 1000000) / totalHHT : 0;
  } catch (error) {
    console.error('Erro ao calcular taxa de gravidade:', error);
    return 0;
  }
}

// Novas funções para dados mensais e acumulados
export async function fetchTaxaFrequenciaAcCpdPorMes(ano: number): Promise<any[]> {
  try {
    const resultado = [];
    let acumuladoOcorrencias = 0;
    let acumuladoHHT = 0;

    for (let mes = 1; mes <= 12; mes++) {
      // Buscar ocorrências AC CPD do mês
      const { data: ocorrenciasMes } = await supabase
        .from('ocorrencias')
        .select('*')
        .eq('ano', ano)
        .eq('mes', mes)
        .eq('tipo_ocorrencia', 'ACIDENTE')
        .eq('houve_afastamento', 'SIM');

      // Buscar HHT do mês
      const { data: hhtMes } = await supabase
        .from('horas_trabalhadas')
        .select('horas_trabalhadas')
        .eq('ano', ano)
        .eq('mes', mes);

      const ocorrenciasMesCount = ocorrenciasMes?.length || 0;
      const hhtMesTotal = hhtMes?.reduce((sum, h) => sum + (h.horas_trabalhadas || 0), 0) || 0;

      // Calcular taxa mensal
      const taxaMensal = hhtMesTotal > 0 ? (ocorrenciasMesCount * 1000000) / hhtMesTotal : 0;

      // Atualizar acumulados
      acumuladoOcorrencias += ocorrenciasMesCount;
      acumuladoHHT += hhtMesTotal;

      // Calcular taxa acumulada
      const taxaAcumulada = acumuladoHHT > 0 ? (acumuladoOcorrencias * 1000000) / acumuladoHHT : 0;

      resultado.push({
        mes,
        mensal: taxaMensal,
        acumulada: taxaAcumulada
      });
    }

    return resultado;
  } catch (error) {
    console.error('Erro ao buscar dados mensais AC CPD:', error);
    return [];
  }
}

export async function fetchTaxaFrequenciaAcSpdPorMes(ano: number): Promise<any[]> {
  try {
    const resultado = [];
    let acumuladoOcorrencias = 0;
    let acumuladoHHT = 0;

    for (let mes = 1; mes <= 12; mes++) {
      // Buscar ocorrências AC SPD do mês
      const { data: ocorrenciasMes } = await supabase
        .from('ocorrencias')
        .select('*')
        .eq('ano', ano)
        .eq('mes', mes)
        .eq('tipo_ocorrencia', 'ACIDENTE')
        .eq('houve_afastamento', 'NÃO');

      // Buscar HHT do mês
      const { data: hhtMes } = await supabase
        .from('horas_trabalhadas')
        .select('horas_trabalhadas')
        .eq('ano', ano)
        .eq('mes', mes);

      const ocorrenciasMesCount = ocorrenciasMes?.length || 0;
      const hhtMesTotal = hhtMes?.reduce((sum, h) => sum + (h.horas_trabalhadas || 0), 0) || 0;

      // Calcular taxa mensal
      const taxaMensal = hhtMesTotal > 0 ? (ocorrenciasMesCount * 1000000) / hhtMesTotal : 0;

      // Atualizar acumulados
      acumuladoOcorrencias += ocorrenciasMesCount;
      acumuladoHHT += hhtMesTotal;

      // Calcular taxa acumulada
      const taxaAcumulada = acumuladoHHT > 0 ? (acumuladoOcorrencias * 1000000) / acumuladoHHT : 0;

      resultado.push({
        mes,
        mensal: taxaMensal,
        acumulada: taxaAcumulada
      });
    }

    return resultado;
  } catch (error) {
    console.error('Erro ao buscar dados mensais AC SPD:', error);
    return [];
  }
}

export async function fetchTaxaGravidadePorMes(ano: number): Promise<any[]> {
  try {
    const resultado = [];
    let acumuladoDiasPerdidos = 0;
    let acumuladoHHT = 0;

    for (let mes = 1; mes <= 12; mes++) {
      // Buscar ocorrências com afastamento do mês
      const { data: ocorrenciasMes } = await supabase
        .from('ocorrencias')
        .select('dias_perdidos, dias_debitados')
        .eq('ano', ano)
        .eq('mes', mes)
        .eq('tipo_ocorrencia', 'ACIDENTE')
        .eq('houve_afastamento', 'SIM');

      // Buscar HHT do mês
      const { data: hhtMes } = await supabase
        .from('horas_trabalhadas')
        .select('horas_trabalhadas')
        .eq('ano', ano)
        .eq('mes', mes);

      const diasPerdidosMes = ocorrenciasMes?.reduce((sum, o) => 
        sum + (o.dias_perdidos || 0) + (o.dias_debitados || 0), 0) || 0;
      const hhtMesTotal = hhtMes?.reduce((sum, h) => sum + (h.horas_trabalhadas || 0), 0) || 0;

      // Calcular taxa mensal
      const taxaMensal = hhtMesTotal > 0 ? (diasPerdidosMes * 1000000) / hhtMesTotal : 0;

      // Atualizar acumulados
      acumuladoDiasPerdidos += diasPerdidosMes;
      acumuladoHHT += hhtMesTotal;

      // Calcular taxa acumulada
      const taxaAcumulada = acumuladoHHT > 0 ? (acumuladoDiasPerdidos * 1000000) / acumuladoHHT : 0;

      resultado.push({
        mes,
        mensal: taxaMensal,
        acumulada: taxaAcumulada
      });
    }

    return resultado;
  } catch (error) {
    console.error('Erro ao buscar dados mensais de gravidade:', error);
    return [];
  }
}

export async function fetchMetaIndicador(ano: number, tipoMeta: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('metas_indicadores')
      .select(tipoMeta)
      .eq('ano', ano)
      .single();

    if (error) throw error;
    return data?.[tipoMeta] || 0;
  } catch (error) {
    console.error('Erro ao buscar meta do indicador:', error);
    return 0;
  }
}
