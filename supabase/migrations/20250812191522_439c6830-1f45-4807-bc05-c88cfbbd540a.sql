
-- Atualizar a política de INSERT para desvios_completos
-- Permitir que usuários autenticados com permissão de desvios possam criar registros
DROP POLICY IF EXISTS "Usuários podem criar desvios para CCAs permitidas" ON public.desvios_completos;

CREATE POLICY "Usuários podem criar desvios para CCAs permitidas" 
ON public.desvios_completos 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    -- Admin pode criar para qualquer CCA
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
    OR 
    -- Usuários com permissão de desvios podem criar para CCAs permitidas (ou sem CCA específica)
    (
      ((get_user_permissions(auth.uid()) ->> 'desvios'::text))::boolean = true
      AND (
        cca_id IS NULL 
        OR get_user_allowed_ccas(auth.uid()) ? (cca_id)::text
      )
    )
  )
);

-- Verificar se existe a política de SELECT e ajustar se necessário
DROP POLICY IF EXISTS "Usuários podem visualizar desvios de CCAs permitidas" ON public.desvios_completos;

CREATE POLICY "Usuários podem visualizar desvios de CCAs permitidas" 
ON public.desvios_completos 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Admin pode ver todos
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
    OR 
    -- Usuários com permissão de desvios podem ver desvios de CCAs permitidas
    (
      ((get_user_permissions(auth.uid()) ->> 'desvios'::text))::boolean = true
      AND (
        cca_id IS NULL 
        OR get_user_allowed_ccas(auth.uid()) ? (cca_id)::text
      )
    )
  )
);

-- Ajustar política de UPDATE também
DROP POLICY IF EXISTS "Usuários podem atualizar desvios de CCAs permitidas" ON public.desvios_completos;

CREATE POLICY "Usuários podem atualizar desvios de CCAs permitidas" 
ON public.desvios_completos 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    -- Admin pode atualizar todos
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
    OR 
    -- Usuários com permissão de desvios podem atualizar desvios de CCAs permitidas
    (
      ((get_user_permissions(auth.uid()) ->> 'desvios'::text))::boolean = true
      AND (
        cca_id IS NULL 
        OR get_user_allowed_ccas(auth.uid()) ? (cca_id)::text
      )
    )
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    -- Admin pode atualizar todos
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
    OR 
    -- Usuários com permissão de desvios podem atualizar desvios de CCAs permitidas
    (
      ((get_user_permissions(auth.uid()) ->> 'desvios'::text))::boolean = true
      AND (
        cca_id IS NULL 
        OR get_user_allowed_ccas(auth.uid()) ? (cca_id)::text
      )
    )
  )
);
