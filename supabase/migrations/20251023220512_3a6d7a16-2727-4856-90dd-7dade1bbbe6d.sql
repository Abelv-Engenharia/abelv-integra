-- Políticas RLS para o bucket contratos-modelos

-- 1. Permitir leitura pública dos modelos de contrato
CREATE POLICY "Permitir leitura pública dos modelos de contrato"
ON storage.objects FOR SELECT
USING (bucket_id = 'contratos-modelos');

-- 2. Permitir upload autenticado
CREATE POLICY "Permitir upload autenticado de modelos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'contratos-modelos');

-- 3. Permitir atualização autenticada
CREATE POLICY "Permitir atualização autenticada de modelos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'contratos-modelos');

-- 4. Permitir exclusão autenticada
CREATE POLICY "Permitir exclusão autenticada de modelos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'contratos-modelos');