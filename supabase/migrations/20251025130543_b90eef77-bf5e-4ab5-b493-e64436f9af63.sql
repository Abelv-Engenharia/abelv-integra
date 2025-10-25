-- Criar bucket para notas fiscais se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'notas-fiscais',
  'notas-fiscais',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para notas fiscais
CREATE POLICY "Usuários podem fazer upload de suas NFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'notas-fiscais' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Usuários podem ler suas próprias NFs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'notas-fiscais' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Usuários podem deletar suas próprias NFs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'notas-fiscais' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Habilitar RLS na tabela prestadores_notas_fiscais
ALTER TABLE prestadores_notas_fiscais ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para prestadores_notas_fiscais
CREATE POLICY "Usuários podem criar suas NFs"
ON prestadores_notas_fiscais FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Usuários podem ler suas NFs"
ON prestadores_notas_fiscais FOR SELECT
TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "Usuários podem atualizar NFs em rascunho"
ON prestadores_notas_fiscais FOR UPDATE
TO authenticated
USING (created_by = auth.uid() AND status = 'Rascunho')
WITH CHECK (created_by = auth.uid());