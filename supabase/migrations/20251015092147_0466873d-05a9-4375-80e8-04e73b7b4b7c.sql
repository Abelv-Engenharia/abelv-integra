-- Corrigir políticas RLS da tabela funcionarios para permitir importação

-- Remover política antiga de INSERT
DROP POLICY IF EXISTS "funcionarios_insert_admin" ON public.funcionarios;

-- Criar nova política de INSERT mais permissiva
CREATE POLICY "funcionarios_insert_admin" 
ON public.funcionarios
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role) 
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

-- Também atualizar a política de UPDATE para consistência
DROP POLICY IF EXISTS "funcionarios_update_admin" ON public.funcionarios;

CREATE POLICY "funcionarios_update_admin"
ON public.funcionarios
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

-- Atualizar política de DELETE para consistência
DROP POLICY IF EXISTS "funcionarios_delete_admin" ON public.funcionarios;

CREATE POLICY "funcionarios_delete_admin"
ON public.funcionarios
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role)
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);