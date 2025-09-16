-- Endurecer RLS de escrita na tabela funcionarios
-- 1) Garantir RLS habilitado e forçado (idempotente)
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios FORCE ROW LEVEL SECURITY;

-- 2) Recriar políticas de escrita restritas a administradores de funcionarios
DROP POLICY IF EXISTS "funcionarios_insert_admin" ON public.funcionarios;
DROP POLICY IF EXISTS "funcionarios_update_admin" ON public.funcionarios;
DROP POLICY IF EXISTS "funcionarios_delete_admin" ON public.funcionarios;

-- Inserção somente para quem pode gerenciar funcionarios
CREATE POLICY "funcionarios_insert_admin"
ON public.funcionarios
FOR INSERT
TO authenticated
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Atualização somente para quem pode gerenciar funcionarios
CREATE POLICY "funcionarios_update_admin"
ON public.funcionarios
FOR UPDATE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Exclusão somente para quem pode gerenciar funcionarios
CREATE POLICY "funcionarios_delete_admin"
ON public.funcionarios
FOR DELETE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()));

-- 3) Registrar auditoria
INSERT INTO public.audit_logs (user_id, action, table_name, details, timestamp)
VALUES (
  auth.uid(),
  'security_policy_update',
  'funcionarios',
  jsonb_build_object(
    'description', 'Criadas políticas de INSERT/UPDATE/DELETE restritas ao admin de funcionários',
    'policies_added', jsonb_build_array('funcionarios_insert_admin','funcionarios_update_admin','funcionarios_delete_admin')
  ),
  now()
);
