
-- Etapa 3: Corrigir políticas RLS das tabelas eSocial

-- ========================================
-- 3.1 - TABELA esocial_s2210_cat
-- ========================================
DROP POLICY IF EXISTS "cat_insert_medical_only" ON public.esocial_s2210_cat;
DROP POLICY IF EXISTS "cat_update_medical_only" ON public.esocial_s2210_cat;
DROP POLICY IF EXISTS "cat_delete_medical_only" ON public.esocial_s2210_cat;

CREATE POLICY "cat_insert_medical_only"
ON public.esocial_s2210_cat
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "cat_update_medical_only"
ON public.esocial_s2210_cat
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
  OR created_by = auth.uid()
)
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "cat_delete_medical_only"
ON public.esocial_s2210_cat
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

-- ========================================
-- 3.2 - TABELA esocial_s2220_exames
-- ========================================
DROP POLICY IF EXISTS "exames_insert_medical_only" ON public.esocial_s2220_exames;
DROP POLICY IF EXISTS "exames_update_medical_only" ON public.esocial_s2220_exames;
DROP POLICY IF EXISTS "exames_delete_medical_only" ON public.esocial_s2220_exames;

CREATE POLICY "exames_insert_medical_only"
ON public.esocial_s2220_exames
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "exames_update_medical_only"
ON public.esocial_s2220_exames
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
  OR created_by = auth.uid()
)
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "exames_delete_medical_only"
ON public.esocial_s2220_exames
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

-- ========================================
-- 3.3 - TABELA esocial_s2230_afastamentos
-- ========================================
DROP POLICY IF EXISTS "afastamentos_insert_medical_only" ON public.esocial_s2230_afastamentos;
DROP POLICY IF EXISTS "afastamentos_update_medical_only" ON public.esocial_s2230_afastamentos;
DROP POLICY IF EXISTS "afastamentos_delete_medical_only" ON public.esocial_s2230_afastamentos;

CREATE POLICY "afastamentos_insert_medical_only"
ON public.esocial_s2230_afastamentos
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "afastamentos_update_medical_only"
ON public.esocial_s2230_afastamentos
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
  OR created_by = auth.uid()
)
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "afastamentos_delete_medical_only"
ON public.esocial_s2230_afastamentos
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

-- ========================================
-- 3.4 - TABELA encarregado_ccas
-- ========================================
DROP POLICY IF EXISTS "Admin podem inserir encarregado_ccas" ON public.encarregado_ccas;
DROP POLICY IF EXISTS "Admin podem atualizar encarregado_ccas" ON public.encarregado_ccas;
DROP POLICY IF EXISTS "Admin podem deletar encarregado_ccas" ON public.encarregado_ccas;

CREATE POLICY "Admin podem inserir encarregado_ccas"
ON public.encarregado_ccas
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "Admin podem atualizar encarregado_ccas"
ON public.encarregado_ccas
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

CREATE POLICY "Admin podem deletar encarregado_ccas"
ON public.encarregado_ccas
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

-- ========================================
-- 3.5 - TABELA efeito_falha_opcoes
-- ========================================
DROP POLICY IF EXISTS "Efeito falha opções - gerenciar (admin)" ON public.efeito_falha_opcoes;

CREATE POLICY "Efeito falha opções - gerenciar (admin)"
ON public.efeito_falha_opcoes
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
-- 3.6 - TABELA empresa_ccas
-- ========================================
DROP POLICY IF EXISTS "empresa_ccas - gerenciar (admin)" ON public.empresa_ccas;

CREATE POLICY "empresa_ccas - gerenciar (admin)"
ON public.empresa_ccas
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
