-- Verificar se o bucket existe e criar políticas de storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('relatorios-inspecao-hsa', 'relatorios-inspecao-hsa', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Criar políticas para permitir leitura dos relatórios
CREATE POLICY IF NOT EXISTS "Permitir leitura de relatórios de HSA para usuários autenticados" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'relatorios-inspecao-hsa' 
  AND auth.role() = 'authenticated'
);

-- Permitir inserção de relatórios para usuários autenticados
CREATE POLICY IF NOT EXISTS "Permitir upload de relatórios de HSA para usuários autenticados" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'relatorios-inspecao-hsa' 
  AND auth.role() = 'authenticated'
);

-- Permitir atualização de relatórios para usuários autenticados
CREATE POLICY IF NOT EXISTS "Permitir atualização de relatórios de HSA para usuários autenticados" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'relatorios-inspecao-hsa' 
  AND auth.role() = 'authenticated'
);

-- Permitir exclusão de relatórios para usuários autenticados
CREATE POLICY IF NOT EXISTS "Permitir exclusão de relatórios de HSA para usuários autenticados" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'relatorios-inspecao-hsa' 
  AND auth.role() = 'authenticated'
);