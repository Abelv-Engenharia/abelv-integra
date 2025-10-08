-- =====================================================
-- FASE 0: REMOVER FUNÇÕES ANTIGAS COM CASCADE
-- =====================================================

DROP FUNCTION IF EXISTS public.get_user_permissions(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_allowed_ccas(uuid) CASCADE;

-- =====================================================
-- FASE 1: CRIAR ESTRUTURAS BASE
-- =====================================================

-- 1.1 Criar ENUM para roles
CREATE TYPE public.app_role AS ENUM ('admin_sistema', 'usuario');

-- 1.2 Criar tabela user_roles
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 1.3 Criar função SECURITY DEFINER para evitar recursão RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
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

-- =====================================================
-- FASE 2: CRIAR TABELA usuario_ccas
-- =====================================================

CREATE TABLE public.usuario_ccas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    cca_id integer REFERENCES public.ccas(id) ON DELETE CASCADE NOT NULL,
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(usuario_id, cca_id)
);

ALTER TABLE public.usuario_ccas ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FASE 3: MODIFICAR TABELA perfis
-- =====================================================

-- Adicionar campo telas_liberadas
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS telas_liberadas text[] DEFAULT '{}';

-- =====================================================
-- FASE 4: MIGRAÇÃO DE DADOS
-- =====================================================

-- 4.1 Migrar administradores para user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin_sistema'::public.app_role
FROM public.profiles
WHERE tipo_usuario = 'administrador'
ON CONFLICT (user_id, role) DO NOTHING;

-- 4.2 Converter perfis.permissoes (JSONB) → perfis.telas_liberadas (text[])
UPDATE public.perfis
SET telas_liberadas = (
    SELECT array_agg(key)
    FROM jsonb_each(COALESCE(permissoes, '{}'::jsonb))
    WHERE value::text = 'true'
)
WHERE permissoes IS NOT NULL;

-- 4.3 Migrar profiles.ccas_permitidas → usuario_ccas (apenas não-admins)
INSERT INTO public.usuario_ccas (usuario_id, cca_id, ativo)
SELECT 
    p.id as usuario_id,
    cca_elem::text::integer as cca_id,
    true as ativo
FROM public.profiles p,
     jsonb_array_elements_text(COALESCE(p.ccas_permitidas, '[]'::jsonb)) cca_elem
WHERE p.tipo_usuario IS DISTINCT FROM 'administrador'
  AND p.ccas_permitidas IS NOT NULL
  AND jsonb_array_length(p.ccas_permitidas) > 0
ON CONFLICT (usuario_id, cca_id) DO NOTHING;

-- =====================================================
-- FASE 5: CRIAR NOVAS FUNÇÕES DE PERMISSÃO
-- =====================================================

-- 5.1 Função get_user_permissions (nova versão - retorna text[])
CREATE FUNCTION public.get_user_permissions(user_id_param uuid)
RETURNS text[]
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_permissions text[];
BEGIN
  -- 1. Se é admin_sistema, retornar acesso total
  IF public.has_role(user_id_param, 'admin_sistema') THEN
    RETURN ARRAY['*'];
  END IF;
  
  -- 2. Buscar união de telas_liberadas de todos os perfis do usuário
  SELECT array_agg(DISTINCT tela)
  INTO user_permissions
  FROM (
    SELECT unnest(p.telas_liberadas) as tela
    FROM public.usuario_perfis up
    JOIN public.perfis p ON up.perfil_id = p.id
    WHERE up.usuario_id = user_id_param
  ) sub;
  
  RETURN COALESCE(user_permissions, '{}');
END;
$$;

-- 5.2 Função get_user_allowed_ccas (nova versão - retorna integer[])
CREATE FUNCTION public.get_user_allowed_ccas(user_id_param uuid)
RETURNS integer[]
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_ccas integer[];
BEGIN
  -- 1. Se é admin_sistema, retornar todos os CCAs ativos
  IF public.has_role(user_id_param, 'admin_sistema') THEN
    SELECT array_agg(id)
    INTO allowed_ccas
    FROM public.ccas
    WHERE ativo = true;
    
    RETURN COALESCE(allowed_ccas, '{}');
  END IF;
  
  -- 2. Buscar CCAs da tabela usuario_ccas
  SELECT array_agg(cca_id)
  INTO allowed_ccas
  FROM public.usuario_ccas
  WHERE usuario_id = user_id_param
    AND ativo = true;
  
  RETURN COALESCE(allowed_ccas, '{}');
END;
$$;

-- =====================================================
-- FASE 6: RLS POLICIES
-- =====================================================

-- 6.1 Policies para user_roles
CREATE POLICY "Admins sistema podem gerenciar roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin_sistema'))
WITH CHECK (public.has_role(auth.uid(), 'admin_sistema'));

CREATE POLICY "Usuários podem ver sua própria role"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin_sistema'));

-- 6.2 Policies para usuario_ccas
CREATE POLICY "Admins sistema podem gerenciar usuario_ccas"
ON public.usuario_ccas FOR ALL
USING (public.has_role(auth.uid(), 'admin_sistema'))
WITH CHECK (public.has_role(auth.uid(), 'admin_sistema'));

CREATE POLICY "Usuários podem ver seus próprios CCAs"
ON public.usuario_ccas FOR SELECT
USING (auth.uid() = usuario_id OR public.has_role(auth.uid(), 'admin_sistema'));

-- 6.3 Atualizar policies de perfis
DROP POLICY IF EXISTS "Admin pode gerenciar perfis" ON public.perfis;
DROP POLICY IF EXISTS "Admin podem gerenciar perfis" ON public.perfis;

CREATE POLICY "Admin sistema pode gerenciar perfis"
ON public.perfis FOR ALL
USING (public.has_role(auth.uid(), 'admin_sistema'))
WITH CHECK (public.has_role(auth.uid(), 'admin_sistema'));

CREATE POLICY "Usuários podem ver perfis"
ON public.perfis FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 6.4 Atualizar policies de usuario_perfis
DROP POLICY IF EXISTS "Admin pode gerenciar usuario_perfis" ON public.usuario_perfis;

CREATE POLICY "Admin sistema pode gerenciar usuario_perfis"
ON public.usuario_perfis FOR ALL
USING (public.has_role(auth.uid(), 'admin_sistema'))
WITH CHECK (public.has_role(auth.uid(), 'admin_sistema'));

CREATE POLICY "Usuários podem ver suas associações de perfis"
ON public.usuario_perfis FOR SELECT
USING (auth.uid() = usuario_id OR public.has_role(auth.uid(), 'admin_sistema'));

-- =====================================================
-- FASE 7: ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_usuario_ccas_usuario_id ON public.usuario_ccas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_ccas_cca_id ON public.usuario_ccas(cca_id);
CREATE INDEX IF NOT EXISTS idx_usuario_perfis_usuario_id ON public.usuario_perfis(usuario_id);
CREATE INDEX IF NOT EXISTS idx_perfis_telas_liberadas ON public.perfis USING gin(telas_liberadas);

-- =====================================================
-- FASE 8: TRIGGER PARA updated_at em usuario_ccas
-- =====================================================

CREATE TRIGGER update_usuario_ccas_updated_at
    BEFORE UPDATE ON public.usuario_ccas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();