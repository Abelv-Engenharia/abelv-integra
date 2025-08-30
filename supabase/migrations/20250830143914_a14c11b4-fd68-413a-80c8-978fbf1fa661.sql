-- Criar bucket para fotos de inspeções SMS
INSERT INTO storage.buckets (id, name, public)
VALUES ('inspecoes-sms-fotos', 'inspecoes-sms-fotos', false);

-- Política para usuários visualizarem fotos de inspeções que eles têm acesso
CREATE POLICY "Usuários podem visualizar fotos de inspeções SMS" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'inspecoes-sms-fotos' 
  AND auth.uid() IS NOT NULL
);

-- Política para usuários fazerem upload de fotos de inspeções
CREATE POLICY "Usuários podem fazer upload de fotos de inspeções SMS" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'inspecoes-sms-fotos' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para usuários atualizarem fotos de inspeções que criaram
CREATE POLICY "Usuários podem atualizar suas fotos de inspeções SMS" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'inspecoes-sms-fotos' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para usuários excluírem fotos de inspeções que criaram
CREATE POLICY "Usuários podem excluir suas fotos de inspeções SMS" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'inspecoes-sms-fotos' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);