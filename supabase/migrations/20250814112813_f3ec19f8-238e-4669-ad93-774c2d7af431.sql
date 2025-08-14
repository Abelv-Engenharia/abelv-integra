
-- Update profiles to include treinamentos permission for users who need to save training execution records
UPDATE perfis 
SET permissoes = jsonb_set(
  COALESCE(permissoes, '{}'::jsonb), 
  '{treinamentos}', 
  'true'::jsonb
)
WHERE nome IN ('Administrador', 'Supervisor', 'Coordenador', 'Gestor');

-- Also ensure they have the treinamentos_execucao menu permission
UPDATE perfis 
SET permissoes = jsonb_set(
  COALESCE(permissoes, '{}'::jsonb), 
  '{menus_sidebar}', 
  CASE 
    WHEN permissoes->'menus_sidebar' IS NULL OR jsonb_typeof(permissoes->'menus_sidebar') != 'array' 
    THEN '["treinamentos_execucao"]'::jsonb
    WHEN NOT (permissoes->'menus_sidebar' ? 'treinamentos_execucao')
    THEN (permissoes->'menus_sidebar') || '["treinamentos_execucao"]'::jsonb
    ELSE permissoes->'menus_sidebar'
  END
)
WHERE nome IN ('Administrador', 'Supervisor', 'Coordenador', 'Gestor');
