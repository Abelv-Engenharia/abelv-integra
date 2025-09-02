-- Atualizar o perfil Administrador com as novas permissões
UPDATE perfis 
SET permissoes = permissoes || '{"prevencao_incendio": true}'::jsonb
WHERE nome = 'Administrador';

-- Atualizar menus_sidebar do perfil Administrador
UPDATE perfis 
SET permissoes = jsonb_set(
  permissoes, 
  '{menus_sidebar}', 
  (permissoes->'menus_sidebar') || 
  '["prevencao_incendio_dashboard", "prevencao_incendio_cadastro_extintores", "prevencao_incendio_inspecao_extintores"]'::jsonb
)
WHERE nome = 'Administrador';