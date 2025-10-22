-- Criar bucket para fotos de checklists de veículos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'veiculos-checklists-fotos',
  'veiculos-checklists-fotos',
  false,
  5242880, -- 5MB
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf',
    'video/mp4'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Políticas RLS para o bucket veiculos-checklists-fotos
CREATE POLICY "Usuários autenticados podem fazer upload de fotos de checklist"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'veiculos-checklists-fotos');

CREATE POLICY "Usuários autenticados podem visualizar fotos de checklist"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'veiculos-checklists-fotos');

CREATE POLICY "Usuários autenticados podem atualizar suas fotos de checklist"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'veiculos-checklists-fotos');

CREATE POLICY "Usuários autenticados podem deletar suas fotos de checklist"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'veiculos-checklists-fotos');