-- Corrigir políticas de segurança para dados médicos sensíveis

-- 1. Remover políticas atuais que permitem acesso amplo demais
DROP POLICY IF EXISTS "CAT - visualizar (autenticados)" ON public.esocial_s2210_cat;
DROP POLICY IF EXISTS "Exames - visualizar (autenticados)" ON public.esocial_s2220_exames;
DROP POLICY IF EXISTS "Afastamentos - visualizar (autenticados)" ON public.esocial_s2230_afastamentos;

-- 2. Criar políticas mais restritivas para CAT (S-2210 - Acidentes de trabalho)
CREATE POLICY "CAT - visualizar (restrito)" 
ON public.esocial_s2210_cat 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Criador do registro
    created_by = auth.uid() OR
    -- Admin com permissão de funcionários
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true OR
    -- Usuário com acesso ao CCA específico
    (cca_id::text = ANY(SELECT jsonb_array_elements_text(get_user_allowed_ccas(auth.uid()))))
  )
);

-- 3. Criar políticas mais restritivas para Exames (S-2220)
CREATE POLICY "Exames - visualizar (restrito)" 
ON public.esocial_s2220_exames 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Criador do registro
    created_by = auth.uid() OR
    -- Admin com permissão de funcionários
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true OR
    -- Usuário com acesso ao CCA específico
    (cca_id::text = ANY(SELECT jsonb_array_elements_text(get_user_allowed_ccas(auth.uid()))))
  )
);

-- 4. Criar políticas mais restritivas para Afastamentos (S-2230)
CREATE POLICY "Afastamentos - visualizar (restrito)" 
ON public.esocial_s2230_afastamentos 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Criador do registro
    created_by = auth.uid() OR
    -- Admin com permissão de funcionários
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true OR
    -- Usuário com acesso ao CCA específico do funcionário
    EXISTS (
      SELECT 1 FROM public.funcionarios f 
      WHERE f.id = funcionario_id 
      AND (f.cca_id::text = ANY(SELECT jsonb_array_elements_text(get_user_allowed_ccas(auth.uid()))))
    )
  )
);

-- 5. Garantir que as políticas de UPDATE também são restritivas para CAT
DROP POLICY IF EXISTS "CAT - atualizar (próprio ou admin)" ON public.esocial_s2210_cat;
CREATE POLICY "CAT - atualizar (restrito)" 
ON public.esocial_s2210_cat 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    created_by = auth.uid() OR
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
  )
);

-- 6. Garantir que as políticas de UPDATE também são restritivas para Exames
DROP POLICY IF EXISTS "Exames - atualizar (próprio ou admin)" ON public.esocial_s2220_exames;
CREATE POLICY "Exames - atualizar (restrito)" 
ON public.esocial_s2220_exames 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    created_by = auth.uid() OR
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
  )
);

-- 7. Criar política de UPDATE para Afastamentos se não existir
CREATE POLICY "Afastamentos - atualizar (restrito)" 
ON public.esocial_s2230_afastamentos 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    created_by = auth.uid() OR
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
  )
);

-- 8. Adicionar auditoria de acesso aos dados médicos
INSERT INTO public.audit_logs (
  user_id,
  action,
  table_name,
  details,
  timestamp
) VALUES (
  auth.uid(),
  'security_policy_update',
  'medical_records_security',
  jsonb_build_object(
    'description', 'Políticas de segurança atualizadas para proteger dados médicos sensíveis',
    'tables_affected', jsonb_build_array('esocial_s2210_cat', 'esocial_s2220_exames', 'esocial_s2230_afastamentos')
  ),
  now()
);