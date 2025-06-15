
/**
 * Função para transformar os dados do formulário da ocorrência
 * em snake_case e nos formatos usados no banco.
 */
export function transformFormDataToOcorrencia(formData: any) {
  return {
    // Datas e horários
    data: formData.data ? (formData.data instanceof Date ? formData.data.toISOString() : new Date(formData.data).toISOString()) : null,
    hora: formData.hora || null,
    mes: formData.mes ? parseInt(formData.mes) : null,
    ano: formData.ano ? parseInt(formData.ano) : null,
    // Identificação básica
    cca: formData.cca || '',
    empresa: formData.empresa || '',
    disciplina: formData.disciplina || '',
    engenheiro_responsavel: formData.engenheiro_responsavel || '',
    supervisor_responsavel: formData.supervisor_responsavel || '',
    encarregado_responsavel: formData.encarregado_responsavel || '',
    colaboradores_acidentados: formData.colaboradores_acidentados || [],
    tipo_ocorrencia: formData.tipo_ocorrencia || '',
    tipo_evento: formData.tipo_evento || '',
    classificacao_ocorrencia: formData.classificacao_ocorrencia || '',
    houve_afastamento: formData.houve_afastamento || '',
    dias_perdidos: formData.dias_perdidos || null,
    dias_debitados: formData.dias_debitados || null,
    parte_corpo_atingida: formData.parte_corpo_atingida || '',
    lateralidade: formData.lateralidade || '',
    agente_causador: formData.agente_causador || '',
    situacao_geradora: formData.situacao_geradora || '',
    natureza_lesao: formData.natureza_lesao || '',
    descricao_ocorrencia: formData.descricao_ocorrencia || formData.descricaoOcorrencia || '',
    numero_cat: formData.numero_cat || formData.numeroCat || '',
    cid: formData.cid || '',
    arquivo_cat: formData.arquivo_cat || null,
    exposicao: formData.exposicao || '',
    controle: formData.controle || '',
    deteccao: formData.deteccao || '',
    efeito_falha: formData.efeito_falha || formData.efeitoFalha || '',
    impacto: formData.impacto || '',
    probabilidade: formData.probabilidade || null,
    severidade: formData.severidade || null,
    classificacao_risco: formData.classificacao_risco || formData.classificacaoRisco || '',
    acoes: Array.isArray(formData.acoes) ? formData.acoes.map(acao => ({
      tratativa_aplicada: acao.tratativa_aplicada || '',
      data_adequacao: acao.data_adequacao ? (acao.data_adequacao instanceof Date ? acao.data_adequacao.toISOString() : acao.data_adequacao) : null,
      responsavel_acao: acao.responsavel_acao || '',
      funcao_responsavel: acao.funcao_responsavel || '',
      situacao: acao.situacao || '',
      status: acao.status || ''
    })) : [],
    investigacao_realizada: formData.investigacao_realizada || '',
    informe_preliminar: formData.informe_preliminar || null,
    relatorio_analise: formData.relatorio_analise || null,
    licoes_aprendidas_enviada: formData.licoes_aprendidas_enviada || '',
    arquivo_licoes_aprendidas: formData.arquivo_licoes_aprendidas || null,
    descricao: formData.descricao_ocorrencia || formData.descricaoOcorrencia || '',
    status: formData.status || 'Em tratativa'
  };
}

