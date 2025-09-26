-- Primeiro, fazer DROP das funções existentes para permitir mudança de tipos
DROP FUNCTION IF EXISTS get_desvios_by_type(jsonb);
DROP FUNCTION IF EXISTS get_desvios_by_discipline(jsonb);
DROP FUNCTION IF EXISTS get_desvios_by_classification(jsonb);
DROP FUNCTION IF EXISTS get_desvios_by_company(jsonb);
DROP FUNCTION IF EXISTS get_desvios_by_event(jsonb);
DROP FUNCTION IF EXISTS get_desvios_by_processo(jsonb);
DROP FUNCTION IF EXISTS get_desvios_by_base_legal(jsonb);

-- Recriar as funções com tipos integer (compatível com TypeScript)

-- Função para desvios por tipo
CREATE OR REPLACE FUNCTION get_desvios_by_type(
  filtros jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(nome text, value integer) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    CASE 
      WHEN UPPER(COALESCE(tr.nome, 'OUTROS')) LIKE '%DESVIO%' THEN 'Desvios'
      WHEN UPPER(COALESCE(tr.nome, 'OUTROS')) = 'OM' OR UPPER(COALESCE(tr.nome, 'OUTROS')) LIKE '%OPORTUNIDADE%' THEN 'OM'
      ELSE COALESCE(tr.nome, 'OUTROS')
    END as nome,
    COUNT(*)::integer as value
  FROM desvios_completos dc
  LEFT JOIN tipos_registro tr ON tr.id = dc.tipo_registro_id
  WHERE dc.tipo_registro_id IS NOT NULL
    AND (filtros->>'year' IS NULL OR EXTRACT(YEAR FROM dc.data_desvio)::text = filtros->>'year')
    AND (filtros->>'month' IS NULL OR EXTRACT(MONTH FROM dc.data_desvio)::text = filtros->>'month')
    AND (filtros->>'ccaId' IS NULL OR dc.cca_id::text = filtros->>'ccaId')
    AND (filtros->>'disciplinaId' IS NULL OR dc.disciplina_id::text = filtros->>'disciplinaId')
    AND (filtros->>'empresaId' IS NULL OR dc.empresa_id::text = filtros->>'empresaId')
    AND (filtros->>'ccaIds' IS NULL OR dc.cca_id = ANY(string_to_array(filtros->>'ccaIds', ',')::int[]))
  GROUP BY 
    CASE 
      WHEN UPPER(COALESCE(tr.nome, 'OUTROS')) LIKE '%DESVIO%' THEN 'Desvios'
      WHEN UPPER(COALESCE(tr.nome, 'OUTROS')) = 'OM' OR UPPER(COALESCE(tr.nome, 'OUTROS')) LIKE '%OPORTUNIDADE%' THEN 'OM'
      ELSE COALESCE(tr.nome, 'OUTROS')
    END
  ORDER BY value DESC;
$$;

-- Função para desvios por disciplina
CREATE OR REPLACE FUNCTION get_desvios_by_discipline(
  filtros jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(nome text, value integer) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COALESCE(d.codigo, 'OUTROS') as nome,
    COUNT(*)::integer as value
  FROM desvios_completos dc
  LEFT JOIN disciplinas d ON d.id = dc.disciplina_id
  WHERE dc.disciplina_id IS NOT NULL
    AND (filtros->>'year' IS NULL OR EXTRACT(YEAR FROM dc.data_desvio)::text = filtros->>'year')
    AND (filtros->>'month' IS NULL OR EXTRACT(MONTH FROM dc.data_desvio)::text = filtros->>'month')
    AND (filtros->>'ccaId' IS NULL OR dc.cca_id::text = filtros->>'ccaId')
    AND (filtros->>'disciplinaId' IS NULL OR dc.disciplina_id::text = filtros->>'disciplinaId')
    AND (filtros->>'empresaId' IS NULL OR dc.empresa_id::text = filtros->>'empresaId')
    AND (filtros->>'ccaIds' IS NULL OR dc.cca_id = ANY(string_to_array(filtros->>'ccaIds', ',')::int[]))
  GROUP BY d.codigo
  ORDER BY value DESC;
$$;

-- Função para desvios por classificação
CREATE OR REPLACE FUNCTION get_desvios_by_classification(
  filtros jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(nome text, value integer, color text) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    UPPER(TRIM(COALESCE(dc.classificacao_risco, 'TRIVIAL'))) as nome,
    COUNT(*)::integer as value,
    CASE UPPER(TRIM(COALESCE(dc.classificacao_risco, 'TRIVIAL')))
      WHEN 'TRIVIAL' THEN '#60a5fa'
      WHEN 'TOLERÁVEL' THEN '#4ade80'
      WHEN 'TOLERAVEL' THEN '#4ade80'
      WHEN 'MODERADO' THEN '#facc15'
      WHEN 'SUBSTANCIAL' THEN '#f97316'
      WHEN 'INTOLERÁVEL' THEN '#ef4444'
      WHEN 'INTOLERAVEL' THEN '#ef4444'
      ELSE '#94a3b8'
    END as color
  FROM desvios_completos dc
  WHERE dc.classificacao_risco IS NOT NULL
    AND (filtros->>'year' IS NULL OR EXTRACT(YEAR FROM dc.data_desvio)::text = filtros->>'year')
    AND (filtros->>'month' IS NULL OR EXTRACT(MONTH FROM dc.data_desvio)::text = filtros->>'month')
    AND (filtros->>'ccaId' IS NULL OR dc.cca_id::text = filtros->>'ccaId')
    AND (filtros->>'disciplinaId' IS NULL OR dc.disciplina_id::text = filtros->>'disciplinaId')
    AND (filtros->>'empresaId' IS NULL OR dc.empresa_id::text = filtros->>'empresaId')
    AND (filtros->>'ccaIds' IS NULL OR dc.cca_id = ANY(string_to_array(filtros->>'ccaIds', ',')::int[]))
  GROUP BY dc.classificacao_risco
  ORDER BY value DESC;
$$;

-- Função para desvios por empresa
CREATE OR REPLACE FUNCTION get_desvios_by_company(
  filtros jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(nome text, value integer) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COALESCE(e.nome, 'OUTROS') as nome,
    COUNT(*)::integer as value
  FROM desvios_completos dc
  LEFT JOIN empresas e ON e.id = dc.empresa_id
  WHERE dc.empresa_id IS NOT NULL
    AND (filtros->>'year' IS NULL OR EXTRACT(YEAR FROM dc.data_desvio)::text = filtros->>'year')
    AND (filtros->>'month' IS NULL OR EXTRACT(MONTH FROM dc.data_desvio)::text = filtros->>'month')
    AND (filtros->>'ccaId' IS NULL OR dc.cca_id::text = filtros->>'ccaId')
    AND (filtros->>'disciplinaId' IS NULL OR dc.disciplina_id::text = filtros->>'disciplinaId')
    AND (filtros->>'empresaId' IS NULL OR dc.empresa_id::text = filtros->>'empresaId')
    AND (filtros->>'ccaIds' IS NULL OR dc.cca_id = ANY(string_to_array(filtros->>'ccaIds', ',')::int[]))
  GROUP BY e.nome
  ORDER BY value DESC;
$$;

-- Função para desvios por evento
CREATE OR REPLACE FUNCTION get_desvios_by_event(
  filtros jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(nome text, value integer) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COALESCE(ei.nome, 'OUTROS') as nome,
    COUNT(*)::integer as value
  FROM desvios_completos dc
  LEFT JOIN eventos_identificados ei ON ei.id = dc.evento_identificado_id
  WHERE dc.evento_identificado_id IS NOT NULL
    AND (filtros->>'year' IS NULL OR EXTRACT(YEAR FROM dc.data_desvio)::text = filtros->>'year')
    AND (filtros->>'month' IS NULL OR EXTRACT(MONTH FROM dc.data_desvio)::text = filtros->>'month')
    AND (filtros->>'ccaId' IS NULL OR dc.cca_id::text = filtros->>'ccaId')
    AND (filtros->>'disciplinaId' IS NULL OR dc.disciplina_id::text = filtros->>'disciplinaId')
    AND (filtros->>'empresaId' IS NULL OR dc.empresa_id::text = filtros->>'empresaId')
    AND (filtros->>'ccaIds' IS NULL OR dc.cca_id = ANY(string_to_array(filtros->>'ccaIds', ',')::int[]))
  GROUP BY ei.nome
  ORDER BY value DESC;
$$;

-- Função para desvios por processo
CREATE OR REPLACE FUNCTION get_desvios_by_processo(
  filtros jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(nome text, value integer) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COALESCE(p.nome, 'OUTROS') as nome,
    COUNT(*)::integer as value
  FROM desvios_completos dc
  LEFT JOIN processos p ON p.id = dc.processo_id
  WHERE dc.processo_id IS NOT NULL
    AND (filtros->>'year' IS NULL OR EXTRACT(YEAR FROM dc.data_desvio)::text = filtros->>'year')
    AND (filtros->>'month' IS NULL OR EXTRACT(MONTH FROM dc.data_desvio)::text = filtros->>'month')
    AND (filtros->>'ccaId' IS NULL OR dc.cca_id::text = filtros->>'ccaId')
    AND (filtros->>'disciplinaId' IS NULL OR dc.disciplina_id::text = filtros->>'disciplinaId')
    AND (filtros->>'empresaId' IS NULL OR dc.empresa_id::text = filtros->>'empresaId')
    AND (filtros->>'ccaIds' IS NULL OR dc.cca_id = ANY(string_to_array(filtros->>'ccaIds', ',')::int[]))
  GROUP BY p.nome
  ORDER BY value DESC;
$$;

-- Função para desvios por base legal
CREATE OR REPLACE FUNCTION get_desvios_by_base_legal(
  filtros jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(nome text, fullname text, value integer) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COALESCE(bl.codigo, 'OUTROS') as nome,
    COALESCE(bl.nome, 'OUTROS') as fullname,
    COUNT(*)::integer as value
  FROM desvios_completos dc
  LEFT JOIN base_legal_opcoes bl ON bl.id = dc.base_legal_opcao_id
  WHERE dc.base_legal_opcao_id IS NOT NULL
    AND (filtros->>'year' IS NULL OR EXTRACT(YEAR FROM dc.data_desvio)::text = filtros->>'year')
    AND (filtros->>'month' IS NULL OR EXTRACT(MONTH FROM dc.data_desvio)::text = filtros->>'month')
    AND (filtros->>'ccaId' IS NULL OR dc.cca_id::text = filtros->>'ccaId')
    AND (filtros->>'disciplinaId' IS NULL OR dc.disciplina_id::text = filtros->>'disciplinaId')
    AND (filtros->>'empresaId' IS NULL OR dc.empresa_id::text = filtros->>'empresaId')
    AND (filtros->>'ccaIds' IS NULL OR dc.cca_id = ANY(string_to_array(filtros->>'ccaIds', ',')::int[]))
  GROUP BY bl.codigo, bl.nome
  ORDER BY value DESC;
$$;