
-- Criar função security definer para buscar permissões do usuário sem recursão RLS
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_uuid UUID)
RETURNS TABLE(permissoes JSONB)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.permissoes
  FROM usuario_perfis up
  JOIN perfis p ON up.perfil_id = p.id
  WHERE up.usuario_id = user_uuid
  LIMIT 1;
$$;

-- Criar função security definer para buscar todos os usuários com seus perfis
CREATE OR REPLACE FUNCTION public.get_all_users_with_profiles()
RETURNS TABLE(
  user_id UUID,
  nome TEXT,
  email TEXT,
  perfil_nome TEXT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    pr.id as user_id,
    pr.nome,
    pr.email,
    pe.nome as perfil_nome
  FROM profiles pr
  LEFT JOIN usuario_perfis up ON pr.id = up.usuario_id
  LEFT JOIN perfis pe ON up.perfil_id = pe.id
  ORDER BY pr.nome;
$$;

-- Criar função security definer para atualizar perfil do usuário
CREATE OR REPLACE FUNCTION public.update_user_profile(user_uuid UUID, new_profile_id INTEGER)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO usuario_perfis (usuario_id, perfil_id)
  VALUES (user_uuid, new_profile_id)
  ON CONFLICT (usuario_id, perfil_id) 
  DO UPDATE SET perfil_id = new_profile_id
  WHERE usuario_perfis.usuario_id = user_uuid;
$$;

-- Criar função security definer para criar usuário com perfil
CREATE OR REPLACE FUNCTION public.create_user_with_profile(
  user_uuid UUID,
  user_nome TEXT,
  user_email TEXT,
  profile_id INTEGER
)
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Inserir ou atualizar perfil
  INSERT INTO profiles (id, nome, email)
  VALUES (user_uuid, user_nome, user_email)
  ON CONFLICT (id) 
  DO UPDATE SET 
    nome = user_nome,
    email = user_email;

  -- Inserir relação usuário-perfil
  INSERT INTO usuario_perfis (usuario_id, perfil_id)
  VALUES (user_uuid, profile_id)
  ON CONFLICT (usuario_id, perfil_id) DO NOTHING;
END;
$$;

-- Criar função security definer para excluir usuário
CREATE OR REPLACE FUNCTION public.delete_user_and_profile(user_uuid UUID)
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Excluir da tabela usuario_perfis primeiro
  DELETE FROM usuario_perfis WHERE usuario_id = user_uuid;
  
  -- Excluir da tabela profiles
  DELETE FROM profiles WHERE id = user_uuid;
END;
$$;

-- Remover políticas RLS problemáticas da tabela usuario_perfis
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar usuario_perfis" ON usuario_perfis;
DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios perfis" ON usuario_perfis;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON usuario_perfis;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os perfis de usuário" ON usuario_perfis;

-- Criar políticas RLS mais simples e seguras
CREATE POLICY "Acesso restrito via funções security definer"
  ON usuario_perfis
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Garantir que RLS está habilitado
ALTER TABLE usuario_perfis ENABLE ROW LEVEL SECURITY;

-- Grant das funções para authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_permissions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users_with_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_profile(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_with_profile(UUID, TEXT, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_and_profile(UUID) TO authenticated;
