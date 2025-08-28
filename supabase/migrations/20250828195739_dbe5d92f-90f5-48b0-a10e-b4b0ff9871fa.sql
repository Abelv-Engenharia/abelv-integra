-- Criar bucket público para logos e imagens
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('public-assets', 'public-assets', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload e visualização de assets públicos
CREATE POLICY "Public assets are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'public-assets');

CREATE POLICY "Allow public upload to assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'public-assets');

CREATE POLICY "Allow public update to assets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'public-assets');