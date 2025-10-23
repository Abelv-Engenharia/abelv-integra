-- Criar tabela para modelos de contratos
CREATE TABLE IF NOT EXISTS contratos_modelos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  tipo_contrato TEXT NOT NULL CHECK (tipo_contrato IN ('prestacao_servico', 'aditivo', 'distrato')),
  arquivo_url TEXT NOT NULL,
  arquivo_nome TEXT NOT NULL,
  codigos_disponiveis JSONB NOT NULL DEFAULT '[]'::jsonb,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Criar tabela para contratos emitidos
CREATE TABLE IF NOT EXISTS contratos_emitidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID NOT NULL REFERENCES prestadores_pj(id) ON DELETE CASCADE,
  tipo_contrato TEXT NOT NULL CHECK (tipo_contrato IN ('prestacao_servico', 'aditivo', 'distrato')),
  modelo_id UUID REFERENCES contratos_modelos(id) ON DELETE SET NULL,
  numero_contrato TEXT NOT NULL,
  dados_preenchidos JSONB NOT NULL DEFAULT '{}'::jsonb,
  pdf_url TEXT,
  pdf_nome TEXT,
  email_enviado BOOLEAN NOT NULL DEFAULT false,
  email_enviado_em TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'confirmado', 'enviado')),
  data_inicio DATE,
  data_fim DATE,
  observacoes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE contratos_modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos_emitidos ENABLE ROW LEVEL SECURITY;

-- Políticas para contratos_modelos
CREATE POLICY "Modelos - visualizar (autenticados)"
  ON contratos_modelos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Modelos - criar (autenticados)"
  ON contratos_modelos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Modelos - atualizar (autenticados)"
  ON contratos_modelos FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Modelos - deletar (autenticados)"
  ON contratos_modelos FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Políticas para contratos_emitidos
CREATE POLICY "Contratos emitidos - visualizar (autenticados)"
  ON contratos_emitidos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Contratos emitidos - criar (autenticados)"
  ON contratos_emitidos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Contratos emitidos - atualizar (autenticados)"
  ON contratos_emitidos FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Contratos emitidos - deletar (autenticados)"
  ON contratos_emitidos FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Criar índices para performance
CREATE INDEX idx_contratos_modelos_tipo ON contratos_modelos(tipo_contrato);
CREATE INDEX idx_contratos_modelos_ativo ON contratos_modelos(ativo);
CREATE INDEX idx_contratos_emitidos_prestador ON contratos_emitidos(prestador_id);
CREATE INDEX idx_contratos_emitidos_status ON contratos_emitidos(status);
CREATE INDEX idx_contratos_emitidos_created_at ON contratos_emitidos(created_at DESC);

-- Triggers para updated_at
CREATE TRIGGER update_contratos_modelos_updated_at
  BEFORE UPDATE ON contratos_modelos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contratos_emitidos_updated_at
  BEFORE UPDATE ON contratos_emitidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Criar storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('contratos-modelos', 'contratos-modelos', false, 10485760, ARRAY['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('contratos-gerados', 'contratos-gerados', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para contratos-modelos
CREATE POLICY "Modelos - upload (autenticados)"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'contratos-modelos');

CREATE POLICY "Modelos - visualizar (autenticados)"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'contratos-modelos');

CREATE POLICY "Modelos - atualizar (autenticados)"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'contratos-modelos');

CREATE POLICY "Modelos - deletar (autenticados)"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'contratos-modelos');

-- Políticas de storage para contratos-gerados
CREATE POLICY "Contratos - upload (autenticados)"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'contratos-gerados');

CREATE POLICY "Contratos - visualizar (autenticados)"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'contratos-gerados');

CREATE POLICY "Contratos - deletar (autenticados)"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'contratos-gerados');