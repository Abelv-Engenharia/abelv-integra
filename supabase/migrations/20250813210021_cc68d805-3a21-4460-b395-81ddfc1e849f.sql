-- Atualizar permissões do perfil Administrador para incluir admin_funcionarios
UPDATE perfis 
SET permissoes = jsonb_set(
  permissoes, 
  '{admin_funcionarios}', 
  'true'::jsonb
)
WHERE nome = 'Administrador';