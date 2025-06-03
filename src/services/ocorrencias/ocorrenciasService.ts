
import { supabase } from '@/integrations/supabase/client';

export interface OcorrenciaFormData {
  data: Date | null;
  hora: string;
  mes: string;
  ano: string;
  cca: string;
  empresa: string;
  disciplina: string;
  engenheiro_responsavel: string;
  supervisor_responsavel: string;
  encarregado_responsavel: string;
  colaboradores_acidentados: Array<{
    colaborador: string;
    funcao: string;
    matricula: string;
  }>;
  tipo_ocorrencia: string;
  tipo_evento: string;
  classificacao_ocorrencia: string;
  houve_afastamento: string;
  dias_perdidos: number | null;
  dias_debitados: number | null;
  parte_corpo_atingida: string;
  lateralidade: string;
  agente_causador: string;
  situacao_geradora: string;
  natureza_lesao: string;
  descricao_ocorrencia: string;
  numero_cat: string;
  cid: string;
  arquivo_cat: File | null;
  exposicao: string;
  controle: string;
  deteccao: string;
  efeito_falha: string;
  impacto: string;
  probabilidade: number | null;
  severidade: number | null;
  classificacao_risco: string;
  acoes: Array<{
    tratativa_aplicada: string;
    data_adequacao: Date | null;
    responsavel_acao: string;
    funcao_responsavel: string;
    situacao: string;
    status: string;
  }>;
  investigacao_realizada: string;
  informe_preliminar: File | null;
  relatorio_analise: File | null;
  licoes_aprendidas_enviada: string;
  arquivo_licoes_aprendidas: File | null;
}

export const createOcorrencia = async (data: OcorrenciaFormData) => {
  try {
    const ocorrenciaData = {
      data: data.data?.toISOString(),
      hora: data.hora,
      mes: parseInt(data.mes),
      ano: parseInt(data.ano),
      cca: data.cca,
      empresa: data.empresa,
      disciplina: data.disciplina,
      tipo_ocorrencia: data.tipo_ocorrencia,
      tipo_evento: data.tipo_evento,
      classificacao_ocorrencia: data.classificacao_ocorrencia,
      classificacao_risco: data.classificacao_risco,
      status: 'Em tratativa',
      engenheiro_responsavel: data.engenheiro_responsavel,
      supervisor_responsavel: data.supervisor_responsavel,
      encarregado_responsavel: data.encarregado_responsavel,
      colaboradores_acidentados: data.colaboradores_acidentados,
      houve_afastamento: data.houve_afastamento,
      dias_perdidos: data.dias_perdidos,
      dias_debitados: data.dias_debitados,
      parte_corpo_atingida: data.parte_corpo_atingida,
      lateralidade: data.lateralidade,
      agente_causador: data.agente_causador,
      situacao_geradora: data.situacao_geradora,
      natureza_lesao: data.natureza_lesao,
      descricao_ocorrencia: data.descricao_ocorrencia,
      numero_cat: data.numero_cat,
      cid: data.cid,
      exposicao: data.exposicao,
      controle: data.controle,
      deteccao: data.deteccao,
      efeito_falha: data.efeito_falha,
      impacto: data.impacto,
      probabilidade: data.probabilidade,
      severidade: data.severidade,
      acoes: data.acoes,
      investigacao_realizada: data.investigacao_realizada,
      licoes_aprendidas_enviada: data.licoes_aprendidas_enviada,
      descricao: data.descricao_ocorrencia
    };

    const { data: result, error } = await supabase
      .from('ocorrencias')
      .insert(ocorrenciaData)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Erro ao criar ocorrência:', error);
    throw error;
  }
};

export const updateOcorrencia = async (id: string, data: Partial<OcorrenciaFormData>) => {
  try {
    const { data: result, error } = await supabase
      .from('ocorrencias')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Erro ao atualizar ocorrência:', error);
    throw error;
  }
};

export const getOcorrenciaById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar ocorrência:', error);
    throw error;
  }
};

export const getAllOcorrencias = async () => {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('*')
      .order('data', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar ocorrências:', error);
    return [];
  }
};

export const getOcorrenciasRecentes = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('*')
      .order('data', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar ocorrências recentes:', error);
    return [];
  }
};
