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
  probabilidade: number | string | null;
  severidade: number | string | null;
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
    console.log('Creating ocorrencia with raw data:', data);
    
    // Garantir que todos os campos obrigatórios estão preenchidos
    if (!data.data || !data.cca || !data.empresa) {
      const missingFields = [];
      if (!data.data) missingFields.push('data');
      if (!data.cca) missingFields.push('cca');
      if (!data.empresa) missingFields.push('empresa');
      throw new Error(`Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`);
    }

    // Mapear os dados do formulário para o formato do banco com logs detalhados
    const ocorrenciaData = {
      data: data.data instanceof Date ? data.data.toISOString() : new Date(data.data).toISOString(),
      hora: data.hora || null,
      mes: data.mes ? parseInt(data.mes) : null,
      ano: data.ano ? parseInt(data.ano) : null,
      cca: data.cca,
      empresa: data.empresa,
      disciplina: data.disciplina || '',
      tipo_ocorrencia: data.tipo_ocorrencia || '',
      tipo_evento: data.tipo_evento || '',
      classificacao_ocorrencia: data.classificacao_ocorrencia || '',
      classificacao_risco: data.classificacao_risco || '',
      status: 'Em tratativa',
      engenheiro_responsavel: data.engenheiro_responsavel || '',
      supervisor_responsavel: data.supervisor_responsavel || '',
      encarregado_responsavel: data.encarregado_responsavel || '',
      colaboradores_acidentados: data.colaboradores_acidentados || [],
      houve_afastamento: data.houve_afastamento || '',
      dias_perdidos: data.dias_perdidos || null,
      dias_debitados: data.dias_debitados || null,
      parte_corpo_atingida: data.parte_corpo_atingida || '',
      lateralidade: data.lateralidade || '',
      agente_causador: data.agente_causador || '',
      situacao_geradora: data.situacao_geradora || '',
      natureza_lesao: data.natureza_lesao || '',
      descricao_ocorrencia: data.descricao_ocorrencia || '',
      numero_cat: data.numero_cat || '',
      cid: data.cid || '',
      exposicao: data.exposicao || '',
      controle: data.controle || '',
      deteccao: data.deteccao || '',
      efeito_falha: data.efeito_falha || '',
      impacto: data.impacto || '',
      probabilidade: data.probabilidade || null,
      severidade: data.severidade || null,
      acoes: convertAcoesForDatabase(data.acoes || []),
      investigacao_realizada: data.investigacao_realizada || '',
      licoes_aprendidas_enviada: data.licoes_aprendidas_enviada || '',
      descricao: data.descricao_ocorrencia || ''
    };

    console.log('Mapped data for database:', ocorrenciaData);
    console.log('About to insert into Supabase...');

    const { data: result, error } = await supabase
      .from('ocorrencias')
      .insert(ocorrenciaData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      throw error;
    }
    
    console.log('Successfully created ocorrencia:', result);
    return result;
  } catch (error) {
    console.error('Complete error in createOcorrencia:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
};

export const updateOcorrencia = async (id: string, formData: any) => {
  try {
    console.log('Updating ocorrencia with data:', formData);
    
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

    console.log('Update data for database:', updateData);

    const { data: result, error } = await supabase
      .from('ocorrencias')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    return result;
  } catch (error) {
    console.error('Erro ao atualizar ocorrência:', error);
    throw error;
  }
};

export const deleteOcorrencia = async (id: string) => {
  try {
    const { error } = await supabase
      .from('ocorrencias')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao excluir ocorrência:', error);
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
    // Buscar todas as ocorrências primeiro
    const { data: ocorrencias, error: ocorrenciasError } = await supabase
      .from('ocorrencias')
      .select('*')
      .order('data', { ascending: false });

    if (ocorrenciasError) throw ocorrenciasError;
    
    if (!ocorrencias || ocorrencias.length === 0) {
      return [];
    }

    // Obter IDs únicos de empresas e CCAs - convertendo para números
    const empresaIds = [...new Set(ocorrencias.map(o => o.empresa).filter(id => id && !isNaN(Number(id))).map(id => Number(id)))];
    const ccaIds = [...new Set(ocorrencias.map(o => o.cca).filter(id => id && !isNaN(Number(id))).map(id => Number(id)))];

    // Buscar dados das empresas
    let empresasMap = new Map();
    if (empresaIds.length > 0) {
      const { data: empresas } = await supabase
        .from('empresas')
        .select('id, nome')
        .in('id', empresaIds);
      
      if (empresas) {
        empresas.forEach(empresa => {
          empresasMap.set(empresa.id.toString(), empresa.nome);
        });
      }
    }

    // Buscar dados dos CCAs
    let ccasMap = new Map();
    if (ccaIds.length > 0) {
      const { data: ccas } = await supabase
        .from('ccas')
        .select('id, nome, codigo')
        .in('id', ccaIds);
      
      if (ccas) {
        ccas.forEach(cca => {
          ccasMap.set(cca.id.toString(), { nome: cca.nome, codigo: cca.codigo });
        });
      }
    }
    
    // Transformar os dados para incluir os nomes das empresas e CCAs
    const transformedData = ocorrencias.map(ocorrencia => ({
      ...ocorrencia,
      empresa: empresasMap.get(ocorrencia.empresa) || ocorrencia.empresa,
      cca_nome: ccasMap.get(ocorrencia.cca)?.nome || ocorrencia.cca,
      cca_codigo: ccasMap.get(ocorrencia.cca)?.codigo || ''
    }));
    
    return transformedData;
  } catch (error) {
    console.error('Erro ao buscar ocorrências:', error);
    return [];
  }
};

export const getOcorrenciasRecentes = async (limit: number = 10) => {
  try {
    // Buscar ocorrências recentes primeiro
    const { data: ocorrencias, error: ocorrenciasError } = await supabase
      .from('ocorrencias')
      .select('*')
      .order('data', { ascending: false })
      .limit(limit);

    if (ocorrenciasError) throw ocorrenciasError;
    
    if (!ocorrencias || ocorrencias.length === 0) {
      return [];
    }

    // Obter IDs únicos de empresas e CCAs - convertendo para números
    const empresaIds = [...new Set(ocorrencias.map(o => o.empresa).filter(id => id && !isNaN(Number(id))).map(id => Number(id)))];
    const ccaIds = [...new Set(ocorrencias.map(o => o.cca).filter(id => id && !isNaN(Number(id))).map(id => Number(id)))];

    // Buscar dados das empresas
    let empresasMap = new Map();
    if (empresaIds.length > 0) {
      const { data: empresas } = await supabase
        .from('empresas')
        .select('id, nome')
        .in('id', empresaIds);
      
      if (empresas) {
        empresas.forEach(empresa => {
          empresasMap.set(empresa.id.toString(), empresa.nome);
        });
      }
    }

    // Buscar dados dos CCAs
    let ccasMap = new Map();
    if (ccaIds.length > 0) {
      const { data: ccas } = await supabase
        .from('ccas')
        .select('id, nome, codigo')
        .in('id', ccaIds);
      
      if (ccas) {
        ccas.forEach(cca => {
          ccasMap.set(cca.id.toString(), { nome: cca.nome, codigo: cca.codigo });
        });
      }
    }
    
    // Transformar os dados para incluir os nomes das empresas e CCAs
    const transformedData = ocorrencias.map(ocorrencia => ({
      ...ocorrencia,
      empresa: empresasMap.get(ocorrencia.empresa) || ocorrencia.empresa,
      cca_nome: ccasMap.get(ocorrencia.cca)?.nome || ocorrencia.cca,
      cca_codigo: ccasMap.get(ocorrencia.cca)?.codigo || ''
    }));
    
    return transformedData;
  } catch (error) {
    console.error('Erro ao buscar ocorrências recentes:', error);
    return [];
  }
};
