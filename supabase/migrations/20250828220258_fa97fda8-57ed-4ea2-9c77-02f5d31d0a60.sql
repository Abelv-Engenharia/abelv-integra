-- Garantir que o bucket seja público
UPDATE storage.buckets 
SET public = true 
WHERE id = 'relatorios-inspecao-hsa';

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Permitir leitura de relatórios de HSA para usuários autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload de relatórios de HSA para usuários autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização de relatórios de HSA para usuários autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Permitir exclusão de relatórios de HSA para usuários autenticados" ON storage.objects;

-- Criar políticas corretas para storage
CREATE POLICY "relatorios_hsa_select" ON storage.objects
FOR SELECT USING (bucket_id = 'relatorios-inspecao-hsa' AND auth.role() = 'authenticated');

CREATE POLICY "relatorios_hsa_insert" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'relatorios-inspecao-hsa' AND auth.role() = 'authenticated');

CREATE POLICY "relatorios_hsa_update" ON storage.objects
FOR UPDATE USING (bucket_id = 'relatorios-inspecao-hsa' AND auth.role() = 'authenticated');

CREATE POLICY "relatorios_hsa_delete" ON storage.objects
FOR DELETE USING (bucket_id = 'relatorios-inspecao-hsa' AND auth.role() = 'authenticated');