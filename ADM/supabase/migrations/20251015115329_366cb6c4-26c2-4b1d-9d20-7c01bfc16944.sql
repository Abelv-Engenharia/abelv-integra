-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'supervisor_adm', 'adm_obra');

-- Criar tabela de roles de usuários
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Criar tabela de acesso por obra
CREATE TABLE public.user_obra_acesso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cca_codigo TEXT NOT NULL REFERENCES nydhus_ccas(codigo) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, cca_codigo)
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_obra_acesso ENABLE ROW LEVEL SECURITY;

-- Função helper segura para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Função helper segura para obter obras do usuário
CREATE OR REPLACE FUNCTION public.get_user_obras(_user_id uuid)
RETURNS TEXT[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(ARRAY_AGG(DISTINCT cca_codigo), ARRAY[]::TEXT[])
  FROM user_obra_acesso
  WHERE user_id = _user_id
$$;

-- RLS para user_roles: usuários veem seus próprios roles
CREATE POLICY "usuarios veem seus roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

-- RLS para user_roles: apenas admins gerenciam roles
CREATE POLICY "admins gerenciam roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS para user_obra_acesso: usuários veem seus acessos
CREATE POLICY "usuarios veem seus acessos"
ON public.user_obra_acesso FOR SELECT
USING (user_id = auth.uid());

-- RLS para user_obra_acesso: apenas admins gerenciam acessos
CREATE POLICY "admins gerenciam acessos"
ON public.user_obra_acesso FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Remover políticas permissivas antigas de analises_contratuais
DROP POLICY IF EXISTS "Permitir leitura de análises para todos" ON analises_contratuais;
DROP POLICY IF EXISTS "Permitir atualização de análises para todos" ON analises_contratuais;
DROP POLICY IF EXISTS "Permitir inserção de análises para todos" ON analises_contratuais;
DROP POLICY IF EXISTS "Permitir exclusão de análises para todos" ON analises_contratuais;

-- Novas políticas baseadas em roles para analises_contratuais
CREATE POLICY "admin acesso total - select"
ON analises_contratuais FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "usuarios veem analises de suas obras - select"
ON analises_contratuais FOR SELECT
USING (
  cca_codigo = ANY(public.get_user_obras(auth.uid()))
);

CREATE POLICY "admin pode inserir"
ON analises_contratuais FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "usuarios podem inserir em suas obras"
ON analises_contratuais FOR INSERT
WITH CHECK (
  cca_codigo = ANY(public.get_user_obras(auth.uid()))
);

CREATE POLICY "admin pode atualizar"
ON analises_contratuais FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "usuarios podem atualizar em suas obras"
ON analises_contratuais FOR UPDATE
USING (
  cca_codigo = ANY(public.get_user_obras(auth.uid()))
);

CREATE POLICY "admin pode deletar"
ON analises_contratuais FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));