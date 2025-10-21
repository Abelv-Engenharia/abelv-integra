-- ========================================
-- COMPLEMENTO: Estruturas adicionais para Prestadores de Serviço
-- ========================================

-- ========================================
-- 1. FUNCTIONS UTILITÁRIAS
-- ========================================

-- Function: get_prestadores_contratos_ativos
CREATE OR REPLACE FUNCTION get_prestadores_contratos_ativos()
RETURNS TABLE (
  contrato_id uuid,
  numero text,
  prestador_nome text,
  datafim date,
  dias_restantes integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.numero,
    c.prestador_nome,
    c.datafim,
    (c.datafim - CURRENT_DATE)::integer as dias_restantes
  FROM prestadores_contratos c
  WHERE c.status = 'ativo'
  AND c.datafim >= CURRENT_DATE
  AND c.datafim <= CURRENT_DATE + interval '30 days'
  ORDER BY c.datafim ASC;
END;
$$;

-- Function: get_prestadores_ferias_proximas
CREATE OR REPLACE FUNCTION get_prestadores_ferias_proximas()
RETURNS TABLE (
  ferias_id uuid,
  prestador_nome text,
  datainicio date,
  dias_restantes integer,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.nomeprestador,
    f.datainicioferias,
    (f.datainicioferias - CURRENT_DATE)::integer as dias_restantes,
    f.status
  FROM prestadores_ferias f
  WHERE f.datainicioferias >= CURRENT_DATE
  AND f.datainicioferias <= CURRENT_DATE + interval '7 days'
  AND f.status IN ('aprovado', 'aguardando_aprovacao')
  ORDER BY f.datainicioferias ASC;
END;
$$;

-- Function: get_nf_pendentes_aprovacao
CREATE OR REPLACE FUNCTION get_nf_pendentes_aprovacao()
RETURNS TABLE (
  nf_id uuid,
  numero text,
  nomeempresa text,
  valor decimal,
  dataemissao date,
  dias_pendente integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.numero,
    n.nomeempresa,
    n.valor,
    n.dataemissao,
    (CURRENT_DATE - n.dataemissao)::integer as dias_pendente
  FROM prestadores_notas_fiscais n
  WHERE n.statusaprovacao = 'pendente'
  AND n.status != 'rascunho'
  ORDER BY n.dataemissao ASC;
END;
$$;

-- Function: calcular_total_passivos_por_cca
CREATE OR REPLACE FUNCTION calcular_total_passivos_por_cca(cca_id_param integer)
RETURNS TABLE (
  cca_codigo text,
  cca_nome text,
  total_passivos decimal,
  quantidade_prestadores bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.cca_codigo,
    p.cca_nome,
    SUM(p.total) as total_passivos,
    COUNT(DISTINCT p.prestador_pj_id) as quantidade_prestadores
  FROM prestadores_passivos p
  WHERE p.cca_id = cca_id_param
  AND p.status IN ('ativo', 'pendente')
  GROUP BY p.cca_codigo, p.cca_nome;
END;
$$;

-- ========================================
-- 2. VIEWS MATERIALIZADAS
-- ========================================

-- View: prestadores_resumo
CREATE MATERIALIZED VIEW IF NOT EXISTS view_prestadores_resumo AS
SELECT 
  p.id,
  p.razaosocial,
  p.cnpj,
  p.nomecompleto as representante,
  p.cpf,
  p.cca_codigo,
  p.cca_nome,
  p.ativo,
  COUNT(DISTINCT c.id) as total_contratos,
  COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'ativo') as contratos_ativos,
  COUNT(DISTINCT n.id) as total_nf,
  SUM(n.valor) FILTER (WHERE n.statusaprovacao = 'aprovado') as valor_total_nf,
  COUNT(DISTINCT f.id) as total_ferias,
  COUNT(DISTINCT f.id) FILTER (WHERE f.status = 'em_ferias') as ferias_ativas,
  COALESCE(SUM(ps.total), 0) as total_passivos,
  p.created_at,
  p.updated_at
FROM prestadores_pj p
LEFT JOIN prestadores_contratos c ON c.prestador_pj_id = p.id
LEFT JOIN prestadores_notas_fiscais n ON n.prestador_pj_id = p.id
LEFT JOIN prestadores_ferias f ON f.prestador_pj_id = p.id
LEFT JOIN prestadores_passivos ps ON ps.prestador_pj_id = p.id AND ps.status IN ('ativo', 'pendente')
GROUP BY p.id, p.razaosocial, p.cnpj, p.nomecompleto, p.cpf, p.cca_codigo, p.cca_nome, p.ativo, p.created_at, p.updated_at;

CREATE UNIQUE INDEX IF NOT EXISTS idx_view_prestadores_resumo_id ON view_prestadores_resumo(id);

-- View: demonstrativos_mensais
CREATE MATERIALIZED VIEW IF NOT EXISTS view_demonstrativos_mensais AS
SELECT 
  d.mes,
  d.cca_codigo,
  d.cca_nome,
  COUNT(DISTINCT d.prestador_pj_id) as total_prestadores,
  SUM(d.salario) as total_salarios,
  SUM(d.ajudaaluguel) as total_ajuda_aluguel,
  SUM(d.reembolsoconvenio) as total_reembolso_convenio,
  SUM(d.descontoconvenio) as total_desconto_convenio,
  SUM(d.multasdescontos) as total_multas,
  SUM(d.valornf) as total_nf,
  SUM(d.valorliquido) as total_liquido
FROM prestadores_demonstrativos d
WHERE d.ativo = true
GROUP BY d.mes, d.cca_codigo, d.cca_nome
ORDER BY d.mes DESC, d.cca_codigo;

CREATE UNIQUE INDEX IF NOT EXISTS idx_view_demonstrativos_mensais_mes_cca 
  ON view_demonstrativos_mensais(mes, cca_codigo);

-- ========================================
-- 3. COMENTÁRIOS DE DOCUMENTAÇÃO
-- ========================================

COMMENT ON TABLE prestadores_pj IS 'Cadastro de empresas prestadoras de serviço (Pessoa Jurídica) com dados da empresa e representante legal';
COMMENT ON TABLE prestadores_contratos IS 'Contratos emitidos (contrato, aditivo ou distrato) dos prestadores';
COMMENT ON TABLE prestadores_demonstrativos IS 'Demonstrativo mensal de prestação de serviço com composição de valores';
COMMENT ON TABLE prestadores_notas_fiscais IS 'Emissão e aprovação de Notas Fiscais dos prestadores';
COMMENT ON TABLE prestadores_ferias IS 'Gestão de férias dos prestadores de serviço';
COMMENT ON TABLE prestadores_ferias_historico IS 'Histórico de mudanças de status das férias';
COMMENT ON TABLE prestadores_passivos IS 'Controle de passivos trabalhistas dos prestadores';
COMMENT ON TABLE prestadores_passivos_historico IS 'Histórico de mudanças nos passivos';

COMMENT ON MATERIALIZED VIEW view_prestadores_resumo IS 'Resumo consolidado de cada prestador com totais de contratos, NFs, férias e passivos';
COMMENT ON MATERIALIZED VIEW view_demonstrativos_mensais IS 'Agregação de valores de demonstrativos por mês e CCA';