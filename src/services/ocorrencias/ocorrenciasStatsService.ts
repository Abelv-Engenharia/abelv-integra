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
