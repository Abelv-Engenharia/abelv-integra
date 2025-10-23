-- Criar bucket para documentos de estoque se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('estoque-documentos', 'estoque-documentos', true)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir upload de documentos para autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Permitir visualização pública de documentos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização de documentos para autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Permitir exclusão de documentos para autenticados" ON storage.objects;

-- Criar políticas de acesso para o bucket
CREATE POLICY "Permitir upload de documentos para autenticados"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'estoque-documentos');

CREATE POLICY "Permitir visualização pública de documentos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'estoque-documentos');

CREATE POLICY "Permitir atualização de documentos para autenticados"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'estoque-documentos')
WITH CHECK (bucket_id = 'estoque-documentos');

CREATE POLICY "Permitir exclusão de documentos para autenticados"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'estoque-documentos');