-- Restringir acesso a dados médicos sensíveis do eSocial
-- Tabelas: esocial_s2210_cat, esocial_s2220_exames, esocial_s2230_afastamentos

-- 1) Garantir RLS habilitado em todas as tabelas médicas
ALTER TABLE public.esocial_s2210_cat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esocial_s2210_cat FORCE ROW LEVEL SECURITY;

ALTER TABLE public.esocial_s2220_exames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esocial_s2220_exames FORCE ROW LEVEL SECURITY;

ALTER TABLE public.esocial_s2230_afastamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esocial_s2230_afastamentos FORCE ROW LEVEL SECURITY;

-- 2) Remover políticas existentes que permitem acesso amplo
DROP POLICY IF EXISTS "CAT - visualizar (restrito)" ON public.esocial_s2210_cat;
DROP POLICY IF EXISTS "CAT - atualizar (restrito)" ON public.esocial_s2210_cat;
DROP POLICY IF EXISTS "CAT - criar (autenticados)" ON public.esocial_s2210_cat;
DROP POLICY IF EXISTS "CAT - excluir (admin)" ON public.esocial_s2210_cat;

DROP POLICY IF EXISTS "Exames - visualizar (restrito)" ON public.esocial_s2220_exames;
DROP POLICY IF EXISTS "Exames - atualizar (restrito)" ON public.esocial_s2220_exames;
DROP POLICY IF EXISTS "Exames - criar (autenticados)" ON public.esocial_s2220_exames;
DROP POLICY IF EXISTS "Exames - excluir (admin)" ON public.esocial_s2220_exames;

-- Remover quaisquer políticas existentes em afastamentos
DROP POLICY IF EXISTS "Afastamentos - visualizar" ON public.esocial_s2230_afastamentos;
DROP POLICY IF EXISTS "Afastamentos - criar" ON public.esocial_s2230_afastamentos;
DROP POLICY IF EXISTS "Afastamentos - atualizar" ON public.esocial_s2230_afastamentos;
DROP POLICY IF EXISTS "Afastamentos - excluir" ON public.esocial_s2230_afastamentos;

-- 3) ESOCIAL_S2210_CAT (Acidentes) - Políticas restritas
-- Visualizar: apenas admin_funcionarios ou quem criou o registro
CREATE POLICY "cat_select_medical_only"
ON public.esocial_s2210_cat
FOR SELECT
TO authenticated
USING (
  user_can_manage_funcionarios(auth.uid()) OR 
  created_by = auth.uid()
);

-- Criar: apenas admin_funcionarios
CREATE POLICY "cat_insert_medical_only"
ON public.esocial_s2210_cat
FOR INSERT
TO authenticated
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Atualizar: apenas admin_funcionarios ou quem criou
CREATE POLICY "cat_update_medical_only"
ON public.esocial_s2210_cat
FOR UPDATE
TO authenticated
USING (
  user_can_manage_funcionarios(auth.uid()) OR 
  created_by = auth.uid()
)
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Excluir: apenas admin_funcionarios
CREATE POLICY "cat_delete_medical_only"
ON public.esocial_s2210_cat
FOR DELETE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()));

-- 4) ESOCIAL_S2220_EXAMES (Exames médicos) - Políticas restritas
-- Visualizar: apenas admin_funcionarios ou quem criou o registro
CREATE POLICY "exames_select_medical_only"
ON public.esocial_s2220_exames
FOR SELECT
TO authenticated
USING (
  user_can_manage_funcionarios(auth.uid()) OR 
  created_by = auth.uid()
);

-- Criar: apenas admin_funcionarios
CREATE POLICY "exames_insert_medical_only"
ON public.esocial_s2220_exames
FOR INSERT
TO authenticated
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Atualizar: apenas admin_funcionarios ou quem criou
CREATE POLICY "exames_update_medical_only"
ON public.esocial_s2220_exames
FOR UPDATE
TO authenticated
USING (
  user_can_manage_funcionarios(auth.uid()) OR 
  created_by = auth.uid()
)
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Excluir: apenas admin_funcionarios
CREATE POLICY "exames_delete_medical_only"
ON public.esocial_s2220_exames
FOR DELETE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()));

-- 5) ESOCIAL_S2230_AFASTAMENTOS (Afastamentos) - Políticas restritas
-- Visualizar: apenas admin_funcionarios ou quem criou o registro
CREATE POLICY "afastamentos_select_medical_only"
ON public.esocial_s2230_afastamentos
FOR SELECT
TO authenticated
USING (
  user_can_manage_funcionarios(auth.uid()) OR 
  created_by = auth.uid()
);

-- Criar: apenas admin_funcionarios
CREATE POLICY "afastamentos_insert_medical_only"
ON public.esocial_s2230_afastamentos
FOR INSERT
TO authenticated
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Atualizar: apenas admin_funcionarios ou quem criou
CREATE POLICY "afastamentos_update_medical_only"
ON public.esocial_s2230_afastamentos
FOR UPDATE
TO authenticated
USING (
  user_can_manage_funcionarios(auth.uid()) OR 
  created_by = auth.uid()
)
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Excluir: apenas admin_funcionarios
CREATE POLICY "afastamentos_delete_medical_only"
ON public.esocial_s2230_afastamentos
FOR DELETE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()));

-- 6) Adicionar triggers para definir created_by automaticamente se não existir
-- Função para definir created_by
CREATE OR REPLACE FUNCTION set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers para as tabelas médicas
DROP TRIGGER IF EXISTS set_created_by_cat ON public.esocial_s2210_cat;
CREATE TRIGGER set_created_by_cat
  BEFORE INSERT ON public.esocial_s2210_cat
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

DROP TRIGGER IF EXISTS set_created_by_exames ON public.esocial_s2220_exames;
CREATE TRIGGER set_created_by_exames
  BEFORE INSERT ON public.esocial_s2220_exames
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

DROP TRIGGER IF EXISTS set_created_by_afastamentos ON public.esocial_s2230_afastamentos;
CREATE TRIGGER set_created_by_afastamentos
  BEFORE INSERT ON public.esocial_s2230_afastamentos
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

-- 7) Registrar auditoria de segurança
INSERT INTO public.audit_logs (user_id, action, table_name, details, timestamp)
VALUES (
  auth.uid(),
  'medical_data_security_hardening',
  'esocial_medical_tables',
  jsonb_build_object(
    'description', 'Restrição de acesso a dados médicos sensíveis - apenas admin_funcionarios e pessoal médico',
    'tables_affected', jsonb_build_array('esocial_s2210_cat','esocial_s2220_exames','esocial_s2230_afastamentos'),
    'security_level', 'medical_data_protection',
    'changes', jsonb_build_array(
      'Removido acesso baseado em CCA',
      'Restrito CREATE/UPDATE/DELETE apenas a admin_funcionarios',
      'SELECT limitado a admin_funcionarios ou creator',
      'Adicionados triggers para created_by'
    )
  ),
  now()
);