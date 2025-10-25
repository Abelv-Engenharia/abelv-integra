-- Remover política restritiva de leitura
DROP POLICY IF EXISTS "Usuários podem ler suas próprias NFs" ON storage.objects;

-- Criar nova política permitindo todos os usuários autenticados lerem NFs
CREATE POLICY "Usuários autenticados podem ler NFs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'notas-fiscais');

-- Também ajustar a política de SELECT na tabela para permitir que aprovadores vejam todas as NFs
DROP POLICY IF EXISTS "Usuários podem ler suas NFs" ON prestadores_notas_fiscais;

CREATE POLICY "Usuários autenticados podem ler todas as NFs"
ON prestadores_notas_fiscais FOR SELECT
TO authenticated
USING (true);