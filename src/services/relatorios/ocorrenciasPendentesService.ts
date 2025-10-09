import { supabase } from '@/integrations/supabase/client';

export interface OcorrenciaPendenteFilters {
  dataInicio?: Date;
  dataFim?: Date;
  ccaId?: string;
  empresaId?: string;
  tipoDocumento?: string;
}

export interface DocumentoPendente {
  tipo: 'CAT' | 'Informe Preliminar' | 'Relatório de Análise' | 'Lições Aprendidas';
  pendente: boolean;
}

export interface OcorrenciaPendente {
  id: string;
  data: string;
  cca: string;
  empresa: string;
  tipo_evento: string;
  classificacao_risco: string;
  descricao_ocorrencia: string;
  status: string;
  houve_afastamento: string;
  arquivo_cat?: string;
  informe_preliminar?: string;
  relatorio_analise?: string;
  licoes_aprendidas_enviada: string;
  arquivo_licoes_aprendidas?: string;
  documentos_pendentes: DocumentoPendente[];
}

function getDocumentosPendentes(ocorrencia: any): DocumentoPendente[] {
  const pendentes: DocumentoPendente[] = [];

  // CAT: Obrigatório quando houver afastamento
  if (ocorrencia.houve_afastamento === 'Sim' && !ocorrencia.arquivo_cat) {
    pendentes.push({ tipo: 'CAT', pendente: true });
  }

  // Informe Preliminar: Sempre obrigatório
  if (!ocorrencia.informe_preliminar) {
    pendentes.push({ tipo: 'Informe Preliminar', pendente: true });
  }

  // Relatório de Análise: Obrigatório para acidentes graves
  if (ocorrencia.tipo_evento === 'Acidente' && !ocorrencia.relatorio_analise) {
    pendentes.push({ tipo: 'Relatório de Análise', pendente: true });
  }

  // Lições Aprendidas: Obrigatório quando marcado como enviado
  if (ocorrencia.licoes_aprendidas_enviada === 'Sim' && !ocorrencia.arquivo_licoes_aprendidas) {
    pendentes.push({ tipo: 'Lições Aprendidas', pendente: true });
  }

  return pendentes;
}

export async function fetchOcorrenciasDocumentosIncompletos(filters: OcorrenciaPendenteFilters = {}) {
  let query: any = supabase
    .from('ocorrencias')
    .select(`
      id,
      data,
      cca,
      empresa,
      tipo_evento,
      classificacao_risco,
      descricao_ocorrencia,
      status,
      houve_afastamento,
      arquivo_cat,
      informe_preliminar,
      relatorio_analise,
      licoes_aprendidas_enviada,
      arquivo_licoes_aprendidas
    `)
    .order('data', { ascending: false });

  if (filters.dataInicio) {
    query = query.gte('data', filters.dataInicio.toISOString().split('T')[0]);
  }

  if (filters.dataFim) {
    query = query.lte('data', filters.dataFim.toISOString().split('T')[0]);
  }

  if (filters.ccaId) {
    query = query.eq('cca', filters.ccaId);
  }

  if (filters.empresaId) {
    query = query.eq('empresa', filters.empresaId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar ocorrências com documentos incompletos:', error);
    throw error;
  }

  // Filtrar apenas as que têm documentos pendentes
  const ocorrenciasComPendencias = (data || [])
    .map((ocorrencia: any) => ({
      ...ocorrencia,
      documentos_pendentes: getDocumentosPendentes(ocorrencia)
    }))
    .filter((ocorrencia: any) => ocorrencia.documentos_pendentes.length > 0);

  // Aplicar filtro de tipo de documento se fornecido
  if (filters.tipoDocumento) {
    return ocorrenciasComPendencias.filter(ocorrencia =>
      ocorrencia.documentos_pendentes.some(doc => doc.tipo === filters.tipoDocumento)
    );
  }

  return ocorrenciasComPendencias as OcorrenciaPendente[];
}

export async function fetchOcorrenciasPendentesPorTipo() {
  const { data, error } = await supabase
    .from('ocorrencias')
    .select(`
      houve_afastamento,
      arquivo_cat,
      informe_preliminar,
      relatorio_analise,
      tipo_evento,
      licoes_aprendidas_enviada,
      arquivo_licoes_aprendidas
    `);

  if (error) {
    console.error('Erro ao buscar contadores por tipo:', error);
    throw error;
  }

  const contadores: Record<string, number> = {
    'CAT': 0,
    'Informe Preliminar': 0,
    'Relatório de Análise': 0,
    'Lições Aprendidas': 0
  };

  (data || []).forEach((ocorrencia: any) => {
    const pendentes = getDocumentosPendentes(ocorrencia);
    pendentes.forEach(doc => {
      contadores[doc.tipo]++;
    });
  });

  return Object.entries(contadores).map(([tipo, count]) => ({
    tipo,
    count
  }));
}
