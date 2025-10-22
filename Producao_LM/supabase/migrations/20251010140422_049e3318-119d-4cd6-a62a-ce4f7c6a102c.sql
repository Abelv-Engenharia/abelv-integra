-- Create enum for document status
CREATE TYPE document_status AS ENUM ('elaboracao', 'revisao', 'aprovado', 'obsoleto');

-- Create enum for distribution status
CREATE TYPE distribution_status AS ENUM ('enviado', 'recebido', 'confirmado');

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL,
  numero_abelv TEXT,
  titulo TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  tipo TEXT NOT NULL,
  formato TEXT NOT NULL,
  versao_atual TEXT NOT NULL DEFAULT 'R00',
  data_revisao DATE NOT NULL DEFAULT CURRENT_DATE,
  status document_status NOT NULL DEFAULT 'elaboracao',
  responsavel_emissao TEXT NOT NULL,
  responsavel_revisao TEXT,
  cliente TEXT NOT NULL,
  projeto TEXT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create document_files table
CREATE TABLE document_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'R00',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create distributions table
CREATE TABLE distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  grd_id UUID,
  destinatario TEXT NOT NULL,
  email_destinatario TEXT,
  data_envio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_recebimento TIMESTAMPTZ,
  status distribution_status NOT NULL DEFAULT 'enviado',
  observacoes TEXT,
  token_confirmacao TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create import_logs table
CREATE TABLE import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  total_rows INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  errors TEXT,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_documents_numero ON documents(numero);
CREATE INDEX idx_documents_cliente ON documents(cliente);
CREATE INDEX idx_documents_projeto ON documents(projeto);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_document_files_document_id ON document_files(document_id);
CREATE INDEX idx_distributions_document_id ON distributions(document_id);
CREATE INDEX idx_distributions_status ON distributions(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for documents table
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - adjust based on auth requirements)
CREATE POLICY "Allow all operations on documents" ON documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on document_files" ON document_files FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on distributions" ON distributions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on import_logs" ON import_logs FOR ALL USING (true) WITH CHECK (true);