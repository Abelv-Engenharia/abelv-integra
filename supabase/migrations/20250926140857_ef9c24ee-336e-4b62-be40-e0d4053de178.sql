-- Atualizar perfil Administrador para incluir permissão admin_comunicados
UPDATE public.perfis 
SET permissoes = jsonb_set(
  COALESCE(permissoes, '{}'),
  '{admin_comunicados}',
  'true'
)
WHERE nome = 'Administrador';

-- Adicionar trigger set_created_by na tabela comunicados
CREATE TRIGGER set_created_by_comunicados
  BEFORE INSERT ON public.comunicados
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();