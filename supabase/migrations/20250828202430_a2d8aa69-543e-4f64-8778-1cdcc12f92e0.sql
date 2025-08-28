-- Criar bucket para anexos de tarefas se ainda não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tarefas-anexos', 'tarefas-anexos', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas RLS para o bucket tarefas-anexos
CREATE POLICY "Usuários podem visualizar anexos de tarefas que podem acessar"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'tarefas-anexos' AND
  EXISTS (
    SELECT 1 FROM public.tarefas t 
    WHERE t.anexo = name 
    AND (t.responsavel_id = auth.uid() OR t.criado_por = auth.uid())
  )
);

CREATE POLICY "Usuários podem fazer upload de anexos para suas tarefas"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tarefas-anexos' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Usuários podem atualizar anexos de suas tarefas"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'tarefas-anexos' AND
  EXISTS (
    SELECT 1 FROM public.tarefas t 
    WHERE t.anexo = name 
    AND (t.responsavel_id = auth.uid() OR t.criado_por = auth.uid())
  )
);

CREATE POLICY "Usuários podem excluir anexos de suas tarefas"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tarefas-anexos' AND
  EXISTS (
    SELECT 1 FROM public.tarefas t 
    WHERE t.anexo = name 
    AND (t.responsavel_id = auth.uid() OR t.criado_por = auth.uid())
  )
);