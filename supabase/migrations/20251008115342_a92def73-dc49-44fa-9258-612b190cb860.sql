-- Habilitar RLS na tabela profiles se ainda não estiver habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Usuários podem visualizar todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os perfis" ON public.profiles;

-- Permitir que usuários autenticados vejam todos os perfis
CREATE POLICY "Usuários autenticados podem visualizar perfis"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Permitir que usuários atualizem apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Permitir que administradores sistema gerenciem todos os perfis
CREATE POLICY "Admins sistema podem gerenciar perfis"
ON public.profiles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin_sistema'))
WITH CHECK (public.has_role(auth.uid(), 'admin_sistema'));

-- Permitir que usuários insiram seu próprio perfil (signup)
CREATE POLICY "Usuários podem criar próprio perfil"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);