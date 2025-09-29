
-- Adicionar menus de consulta de extintores e inspeções ao perfil Administrador
UPDATE perfis 
SET permissoes = jsonb_set(
  permissoes,
  '{menus_sidebar}',
  (
    SELECT jsonb_agg(DISTINCT value)
    FROM (
      SELECT value FROM jsonb_array_elements_text(permissoes->'menus_sidebar')
      UNION ALL
      SELECT 'prevencao_incendio_consulta_extintores'
      UNION ALL
      SELECT 'prevencao_incendio_consulta_inspecoes'
    ) AS combined(value)
  )
)
WHERE nome = 'Administrador'
AND NOT (permissoes->'menus_sidebar' @> '["prevencao_incendio_consulta_extintores"]'::jsonb);
