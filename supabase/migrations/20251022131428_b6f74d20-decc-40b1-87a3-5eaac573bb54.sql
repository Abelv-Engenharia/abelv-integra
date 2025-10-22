-- Adicionar política de DELETE para veiculos_condutores
-- Permite que usuários autenticados com permissões adequadas possam deletar condutores

-- Remover política de DELETE existente se houver
DROP POLICY IF EXISTS "veiculos_condutores_delete_policy" ON veiculos_condutores;

-- Criar política que permite DELETE para usuários autenticados com permissão
CREATE POLICY "veiculos_condutores_delete_policy"
ON veiculos_condutores
FOR DELETE
TO public
USING (
  auth.uid() IS NOT NULL 
  AND (
    'veiculos_visualizar' = ANY (get_user_permissions(auth.uid()))
    OR 'veiculos_edicao' = ANY (get_user_permissions(auth.uid()))
    OR has_role(auth.uid(), 'admin_sistema')
    OR '*' = ANY (get_user_permissions(auth.uid()))
  )
);