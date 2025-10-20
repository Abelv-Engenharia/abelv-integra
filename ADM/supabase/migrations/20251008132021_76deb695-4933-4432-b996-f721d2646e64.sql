-- Criar bucket para contratos de alojamento
INSERT INTO storage.buckets (id, name, public)
VALUES ('contratos-alojamento', 'contratos-alojamento', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas RLS para o bucket contratos-alojamento
CREATE POLICY "Permitir leitura pública dos contratos"
ON storage.objects FOR SELECT
USING (bucket_id = 'contratos-alojamento');

CREATE POLICY "Permitir upload de contratos para todos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'contratos-alojamento');

CREATE POLICY "Permitir atualização de contratos para todos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'contratos-alojamento');

CREATE POLICY "Permitir exclusão de contratos para todos"
ON storage.objects FOR DELETE
USING (bucket_id = 'contratos-alojamento');