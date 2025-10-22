-- Criar bucket para documentos de veículos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'veiculos-documentos',
  'veiculos-documentos',
  true,
  10485760, -- 10MB
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de documentos (usuários autenticados)
CREATE POLICY "Usuários autenticados podem fazer upload de documentos de veículos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'veiculos-documentos');

-- Política para visualizar documentos (público, pois o bucket é público)
CREATE POLICY "Qualquer um pode visualizar documentos de veículos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'veiculos-documentos');

-- Política para deletar documentos (usuários autenticados)
CREATE POLICY "Usuários autenticados podem deletar documentos de veículos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'veiculos-documentos');