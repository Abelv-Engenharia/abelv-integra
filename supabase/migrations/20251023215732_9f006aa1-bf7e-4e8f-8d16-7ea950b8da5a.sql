-- Criar tabela contratos_emitidos
CREATE TABLE IF NOT EXISTS contratos_emitidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID NOT NULL REFERENCES prestadores(id) ON DELETE CASCADE,
  tipo_contrato TEXT NOT NULL CHECK (tipo_contrato IN ('prestacao_servico', 'aditivo', 'distrato')),
  modelo_id UUID REFERENCES contratos_modelos(id) ON DELETE SET NULL,
  numero_contrato TEXT NOT NULL,
  dados_preenchidos JSONB DEFAULT '{}'::jsonb,
  pdf_url TEXT,
  pdf_nome TEXT,
  email_enviado BOOLEAN DEFAULT false,
  email_enviado_em TIMESTAMPTZ,
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'confirmado', 'enviado')),
  data_inicio DATE,
  data_fim DATE,
  observacoes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_contratos_emitidos_prestador ON contratos_emitidos(prestador_id);
CREATE INDEX IF NOT EXISTS idx_contratos_emitidos_modelo ON contratos_emitidos(modelo_id);
CREATE INDEX IF NOT EXISTS idx_contratos_emitidos_status ON contratos_emitidos(status);
CREATE INDEX IF NOT EXISTS idx_contratos_emitidos_tipo ON contratos_emitidos(tipo_contrato);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_contratos_emitidos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contratos_emitidos_updated_at
  BEFORE UPDATE ON contratos_emitidos
  FOR EACH ROW
  EXECUTE FUNCTION update_contratos_emitidos_updated_at();

-- RLS
ALTER TABLE contratos_emitidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura autenticada de contratos emitidos"
  ON contratos_emitidos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir inserção autenticada de contratos emitidos"
  ON contratos_emitidos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização autenticada de contratos emitidos"
  ON contratos_emitidos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Permitir exclusão autenticada de contratos emitidos"
  ON contratos_emitidos FOR DELETE
  TO authenticated
  USING (true);

-- Bucket para PDFs de contratos
INSERT INTO storage.buckets (id, name, public)
VALUES ('contratos-emitidos', 'contratos-emitidos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
CREATE POLICY "Permitir upload autenticado de contratos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'contratos-emitidos');

CREATE POLICY "Permitir leitura pública de contratos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'contratos-emitidos');

CREATE POLICY "Permitir atualização autenticada de contratos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'contratos-emitidos');

CREATE POLICY "Permitir exclusão autenticada de contratos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'contratos-emitidos');