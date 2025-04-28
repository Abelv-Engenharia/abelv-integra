
-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES 
  ('treinamentos', 'treinamentos', true, false, 104857600, '{image/jpeg,image/png,application/pdf}'::text[]),
  ('certificados', 'certificados', true, false, 104857600, '{image/jpeg,image/png,application/pdf}'::text[]),
  ('desvios', 'desvios', true, false, 104857600, '{image/jpeg,image/png,application/pdf}'::text[]),
  ('ocorrencias', 'ocorrencias', true, false, 104857600, '{image/jpeg,image/png,application/pdf}'::text[]),
  ('funcionarios', 'funcionarios', true, false, 5242880, '{image/jpeg,image/png}'::text[]),
  ('tarefas', 'tarefas', true, false, 104857600, '{image/jpeg,image/png,application/pdf}'::text[]),
  ('inspecoes', 'inspecoes', true, false, 104857600, '{image/jpeg,image/png,application/pdf}'::text[]);

-- Set up bucket security policies
CREATE POLICY "Authenticated users can upload files" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id IN ('treinamentos', 'certificados', 'desvios', 'ocorrencias', 'funcionarios', 'tarefas', 'inspecoes'));

CREATE POLICY "Authenticated users can update their files" 
  ON storage.objects FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner);

CREATE POLICY "Anyone can view public files" 
  ON storage.objects FOR SELECT 
  TO authenticated
  USING (bucket_id IN ('treinamentos', 'certificados', 'desvios', 'ocorrencias', 'funcionarios', 'tarefas', 'inspecoes'));

CREATE POLICY "Authenticated users can delete their files" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner);
