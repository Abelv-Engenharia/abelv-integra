-- Remove políticas antigas que usam verificação incorreta
DROP POLICY IF EXISTS "Comunicados - criar (admin)" ON comunicados;
DROP POLICY IF EXISTS "Comunicados - atualizar (admin)" ON comunicados;
DROP POLICY IF EXISTS "Comunicados - deletar (admin)" ON comunicados;

-- Cria política de INSERT correta
CREATE POLICY "Comunicados - criar (autenticados com permissão)"
ON comunicados
FOR INSERT
TO authenticated
WITH CHECK (
  'comunicados_cadastro' = ANY(get_user_permissions(auth.uid()))
  OR has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
);

-- Cria política de UPDATE correta
CREATE POLICY "Comunicados - atualizar (autenticados com permissão)"
ON comunicados
FOR UPDATE
TO authenticated
USING (
  'comunicados_edicao' = ANY(get_user_permissions(auth.uid()))
  OR has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
)
WITH CHECK (
  'comunicados_edicao' = ANY(get_user_permissions(auth.uid()))
  OR has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
);

-- Cria política de DELETE correta
CREATE POLICY "Comunicados - deletar (autenticados com permissão)"
ON comunicados
FOR DELETE
TO authenticated
USING (
  'comunicados_edicao' = ANY(get_user_permissions(auth.uid()))
  OR has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
);