
-- Criar o bucket para anexos de tarefas
INSERT INTO storage.buckets (id, name, public)
VALUES ('tarefas-anexos', 'tarefas-anexos', false)
ON CONFLICT (id) DO NOTHING;

-- Permitir INSERT (upload) apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload task attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tarefas-anexos');

-- Permitir SELECT (download/leitura) apenas para usuários autenticados
CREATE POLICY "Authenticated users can view task attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'tarefas-anexos');

-- Permitir UPDATE apenas para usuários autenticados
CREATE POLICY "Authenticated users can update task attachments"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tarefas-anexos');

-- Permitir DELETE apenas para usuários autenticados
CREATE POLICY "Authenticated users can delete task attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tarefas-anexos');
