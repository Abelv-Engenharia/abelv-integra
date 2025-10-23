-- 1. Criar bucket público para relatórios automatizados
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'relatorios-automaticos', 
  'relatorios-automaticos', 
  true, 
  10485760,
  ARRAY['image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Política RLS: service_role pode fazer upload
CREATE POLICY "Service role pode fazer upload de relatórios"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'relatorios-automaticos');

-- 3. Política RLS: leitura pública
CREATE POLICY "Leitura pública de relatórios"
ON storage.objects FOR SELECT
USING (bucket_id = 'relatorios-automaticos');

-- 4. Adicionar colunas em webhook_logs para rastreamento de anexos gerados
ALTER TABLE webhook_logs 
ADD COLUMN IF NOT EXISTS anexo_gerado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS anexo_url TEXT,
ADD COLUMN IF NOT EXISTS tempo_geracao_ms INTEGER;