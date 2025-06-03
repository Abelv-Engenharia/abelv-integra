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

// Função para converter acoes com Date para formato JSON
const convertAcoesForDatabase = (acoes: OcorrenciaFormData['acoes']) => {
  return acoes.map(acao => ({
    ...acao,
    data_adequacao: acao.data_adequacao ? acao.data_adequacao.toISOString() : null
  }));
};

// Função para converter acoes do banco para o formulário
const convertAcoesFromDatabase = (acoes: any[]): OcorrenciaFormData['acoes'] => {
  if (!Array.isArray(acoes)) return [];
  
  return acoes.map(acao => ({
    tratativa_aplicada: acao.tratativa_aplicada || '',
    data_adequacao: acao.data_adequacao ? new Date(acao.data_adequacao) : null,
    responsavel_acao: acao.responsavel_acao || '',
    funcao_responsavel: acao.funcao_responsavel || '',
    situacao: acao.situacao || '',
    status: acao.status || ''
  }));
};

// Função para converter colaboradores do banco para o formulário
const convertColaboradoresFromDatabase = (colaboradores: any): OcorrenciaFormData['colaboradores_acidentados'] => {
  if (!Array.isArray(colaboradores)) return [];
  
  return colaboradores.map(colaborador => ({
    colaborador: colaborador.colaborador || '',
    funcao: colaborador.funcao || '',
    matricula: colaborador.matricula || ''
  }));
};

export const createOcorrencia = async (data: any) => {
  try {
    // Mapear os dados do formulário (camelCase) para o formato do banco (snake_case)
    const ocorrenciaData = {
      data: data.data?.toISOString(),
      hora: data.hora,
      mes: parseInt(data.mes),
      ano: parseInt(data.ano),
      cca: data.cca,
      empresa: data.empresa,
      disciplina: data.disciplina,
      tipo_ocorrencia: data.tipoOcorrencia || data.tipo_ocorrencia,
      tipo_evento: data.tipoEvento || data.tipo_evento,
      classificacao_ocorrencia: data.classificacaoOcorrencia || data.classificacao_ocorrencia,
      classificacao_risco: data.classificacaoRisco || data.classificacao_risco,
      status: 'Em tratativa',
      engenheiro_responsavel: data.engenheiroResponsavel || data.engenheiro_responsavel,
      supervisor_responsavel: data.supervisorResponsavel || data.supervisor_responsavel,
      encarregado_responsavel: data.encarregadoResponsavel || data.encarregado_responsavel,
      colaboradores_acidentados: data.colaboradoresAcidentados || data.colaboradores_acidentados || [],
      houve_afastamento: data.houveAfastamento || data.houve_afastamento,
      dias_perdidos: data.diasPerdidos || data.dias_perdidos,
      dias_debitados: data.diasDebitados || data.dias_debitados,
      parte_corpo_atingida: data.parteCorpoAtingida || data.parte_corpo_atingida,
      lateralidade: data.lateralidade,
      agente_causador: data.agenteCausador || data.agente_causador,
      situacao_geradora: data.situacaoGeradora || data.situacao_geradora,
      natureza_lesao: data.naturezaLesao || data.natureza_lesao,
      descricao_ocorrencia: data.descricaoOcorrencia || data.descricao_ocorrencia,
      numero_cat: data.numeroCat || data.numero_cat,
      cid: data.cid,
      exposicao: data.exposicao,
      controle: data.controle,
      deteccao: data.deteccao,
      efeito_falha: data.efeitoFalha || data.efeito_falha,
      impacto: data.impacto,
      probabilidade: data.probabilidade,
      severidade: data.severidade,
      acoes: convertAcoesForDatabase(data.acoes || []),
      investigacao_realizada: data.investigacaoRealizada || data.investigacao_realizada,
      licoes_aprendidas_enviada: data.licoesAprendidasEnviada || data.licoes_aprendidas_enviada,
      descricao: data.descricaoOcorrencia || data.descricao_ocorrencia
    };

    console.log('Dados sendo enviados para o banco:', ocorrenciaData);

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

export const updateOcorrencia = async (id: string, formData: Partial<OcorrenciaFormData>) => {
  try {
    // Converter os dados do formulário para o formato do banco
    const updateData: any = { ...formData };
    
    if (formData.data) {
      updateData.data = formData.data.toISOString();
    }
    
    if (formData.mes) {
      updateData.mes = parseInt(formData.mes);
    }
    
    if (formData.ano) {
      updateData.ano = parseInt(formData.ano);
    }
    
    if (formData.acoes) {
      updateData.acoes = convertAcoesForDatabase(formData.acoes);
    }

    if (formData.descricao_ocorrencia) {
      updateData.descricao = formData.descricao_ocorrencia;
    }

    const { data: result, error } = await supabase
      .from('ocorrencias')
      .update(updateData)
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
