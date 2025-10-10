-- Dropar políticas anteriores
DROP POLICY IF EXISTS "Admin podem inserir encarregado_ccas" ON encarregado_ccas;
DROP POLICY IF EXISTS "Admin podem atualizar encarregado_ccas" ON encarregado_ccas;
DROP POLICY IF EXISTS "Admin podem deletar encarregado_ccas" ON encarregado_ccas;

-- Criar políticas corrigidas que verificam admin_sistema
CREATE POLICY "Admin podem inserir encarregado_ccas"
ON encarregado_ccas FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema') 
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "Admin podem atualizar encarregado_ccas"
ON encarregado_ccas FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema') 
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema') 
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);

CREATE POLICY "Admin podem deletar encarregado_ccas"
ON encarregado_ccas FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema') 
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR user_can_manage_funcionarios(auth.uid())
);