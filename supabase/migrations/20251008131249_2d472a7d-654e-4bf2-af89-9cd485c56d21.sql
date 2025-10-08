-- Corrigir políticas RLS que usam operador incorreto em get_user_permissions
-- A função get_user_permissions retorna text[], não JSONB
-- Deve-se usar 'valor' = ANY(array) ao invés de array->>'valor'

-- ============================================
-- TABELA: perfis
-- ============================================

DROP POLICY IF EXISTS "admin_usuarios pode gerenciar perfis" ON public.perfis;
CREATE POLICY "admin_usuarios pode gerenciar perfis" 
ON public.perfis FOR ALL 
USING ('admin_usuarios' = ANY(public.get_user_permissions(auth.uid())));

-- ============================================
-- TABELA: profiles
-- ============================================

DROP POLICY IF EXISTS "users_update_own_profile_or_admin" ON public.profiles;
CREATE POLICY "users_update_own_profile_or_admin" 
ON public.profiles FOR UPDATE 
USING (
  auth.uid() = id 
  OR 'admin_usuarios' = ANY(public.get_user_permissions(auth.uid()))
);

DROP POLICY IF EXISTS "Admin podem criar usuários" ON public.profiles;
CREATE POLICY "Admin podem criar usuários" 
ON public.profiles FOR INSERT 
WITH CHECK ('admin_usuarios' = ANY(public.get_user_permissions(auth.uid())));

DROP POLICY IF EXISTS "Admin podem visualizar usuários" ON public.profiles;
CREATE POLICY "Admin podem visualizar usuários" 
ON public.profiles FOR SELECT 
USING ('admin_usuarios' = ANY(public.get_user_permissions(auth.uid())));

-- ============================================
-- TABELA: usuario_perfis
-- ============================================

DROP POLICY IF EXISTS "admin_usuarios pode gerenciar associações" ON public.usuario_perfis;
CREATE POLICY "admin_usuarios pode gerenciar associações" 
ON public.usuario_perfis FOR ALL 
USING ('admin_usuarios' = ANY(public.get_user_permissions(auth.uid())));