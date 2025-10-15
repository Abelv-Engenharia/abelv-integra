
-- Etapa 2: Corrigir políticas RLS restritivas em múltiplas tabelas

-- ========================================
-- 2.1 - TABELA disciplinas
-- ========================================
DROP POLICY IF EXISTS "Disciplinas - gerenciar (admin)" ON public.disciplinas;

CREATE POLICY "Disciplinas - gerenciar (admin)" 
ON public.disciplinas
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

-- ========================================
-- 2.2 - TABELA empresas
-- ========================================
DROP POLICY IF EXISTS "Empresas - criar (admin)" ON public.empresas;
DROP POLICY IF EXISTS "Empresas - atualizar (admin)" ON public.empresas;
DROP POLICY IF EXISTS "Empresas - deletar (admin)" ON public.empresas;

CREATE POLICY "Empresas - criar (admin)"
ON public.empresas
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "Empresas - atualizar (admin)"
ON public.empresas
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "Empresas - deletar (admin)"
ON public.empresas
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

-- ========================================
-- 2.3 - TABELA engenheiros
-- ========================================
DROP POLICY IF EXISTS "Admin podem gerenciar engenheiros" ON public.engenheiros;

CREATE POLICY "Admin podem gerenciar engenheiros"
ON public.engenheiros
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

-- ========================================
-- 2.4 - TABELA encarregados (CRÍTICO - Remover vulnerabilidade)
-- ========================================
-- REMOVER a política insegura que permite acesso total
DROP POLICY IF EXISTS "Permitir acesso" ON public.encarregados;
DROP POLICY IF EXISTS "Usuários autenticados podem ver encarregados" ON public.encarregados;

-- Criar políticas seguras separadas
CREATE POLICY "Encarregados - visualizar (autenticados)"
ON public.encarregados
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Encarregados - criar (admin)"
ON public.encarregados
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "Encarregados - atualizar (admin)"
ON public.encarregados
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "Encarregados - deletar (admin)"
ON public.encarregados
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);
