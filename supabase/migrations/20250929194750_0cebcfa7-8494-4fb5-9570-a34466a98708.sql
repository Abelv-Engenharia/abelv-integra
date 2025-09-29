-- Adicionar permissões de consulta de extintores e inspeções aos usuários administradores
UPDATE profiles
SET menus_sidebar = (
  SELECT jsonb_agg(DISTINCT value)
  FROM (
    SELECT value FROM jsonb_array_elements_text(menus_sidebar)
    UNION ALL
    SELECT 'prevencao_incendio_consulta_extintores'
    UNION ALL
    SELECT 'prevencao_incendio_consulta_inspecoes'
  ) AS combined(value)
)
WHERE tipo_usuario = 'administrador'
AND NOT (menus_sidebar @> '["prevencao_incendio_consulta_extintores"]'::jsonb);