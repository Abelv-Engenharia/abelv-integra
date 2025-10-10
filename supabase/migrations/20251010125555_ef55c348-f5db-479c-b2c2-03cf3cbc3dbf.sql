-- Remover políticas antigas do bucket comunicados-anexos se existirem
DROP POLICY IF EXISTS "Comunicados anexos - upload (admin)" ON storage.objects;
DROP POLICY IF EXISTS "Comunicados anexos - leitura pública" ON storage.objects;
DROP POLICY IF EXISTS "Comunicados anexos - deletar (admin)" ON storage.objects;

-- Política para permitir upload de anexos por usuários com permissão de comunicados
CREATE POLICY "Comunicados anexos - upload (autenticados com permissão)"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'comunicados-anexos'
  AND (
    'comunicados_cadastro' = ANY(get_user_permissions(auth.uid()))
    OR has_role(auth.uid(), 'admin_sistema')
    OR '*' = ANY(get_user_permissions(auth.uid()))
  )
);

-- Política para permitir leitura pública dos anexos (bucket é público)
CREATE POLICY "Comunicados anexos - leitura pública"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'comunicados-anexos');

-- Política para permitir deletar anexos por usuários com permissão
CREATE POLICY "Comunicados anexos - deletar (autenticados com permissão)"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'comunicados-anexos'
  AND (
    'comunicados_edicao' = ANY(get_user_permissions(auth.uid()))
    OR has_role(auth.uid(), 'admin_sistema')
    OR '*' = ANY(get_user_permissions(auth.uid()))
  )
);