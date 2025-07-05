
-- Criar o bucket para relatórios de inspeção HSA
INSERT INTO storage.buckets (id, name, public)
VALUES ('relatorios-inspecao-hsa', 'relatorios-inspecao-hsa', false)
ON CONFLICT (id) DO NOTHING;

-- Permitir INSERT (upload) apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload inspection reports"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'relatorios-inspecao-hsa');

-- Permitir SELECT (download/leitura) apenas para usuários autenticados
CREATE POLICY "Authenticated users can view inspection reports"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'relatorios-inspecao-hsa');

-- Permitir UPDATE apenas para usuários autenticados
CREATE POLICY "Authenticated users can update inspection reports"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'relatorios-inspecao-hsa');

-- Permitir DELETE apenas para usuários autenticados
CREATE POLICY "Authenticated users can delete inspection reports"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'relatorios-inspecao-hsa');

-- Adicionar coluna para armazenar URL do relatório na tabela execucao_hsa
ALTER TABLE public.execucao_hsa 
ADD COLUMN relatorio_url TEXT;
