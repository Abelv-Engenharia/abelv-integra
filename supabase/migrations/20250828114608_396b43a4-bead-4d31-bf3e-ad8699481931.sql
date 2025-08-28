-- Adicionar permissões do GRO ao perfil Administrador
UPDATE public.perfis 
SET permissoes = jsonb_set(
  jsonb_set(permissoes, '{gro_dashboard}', 'true'::jsonb),
  '{gro_avaliacao_riscos}', 'true'::jsonb
)
WHERE nome = 'Administrador';

-- Também adicionar os menus_sidebar do GRO se não existirem
UPDATE public.perfis 
SET permissoes = jsonb_set(
  permissoes, 
  '{menus_sidebar}', 
  COALESCE(permissoes->'menus_sidebar', '[]'::jsonb) || '["gro_dashboard", "gro_avaliacao_riscos"]'::jsonb
)
WHERE nome = 'Administrador'
AND NOT (permissoes->'menus_sidebar' ? 'gro_dashboard');