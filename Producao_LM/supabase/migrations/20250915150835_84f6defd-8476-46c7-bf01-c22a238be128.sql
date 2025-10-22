-- Criar tabelas para sistema completo de upload e controle de distribuição

-- Tabela de documentos principais
CREATE TABLE public.documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero text NOT NULL UNIQUE,
  titulo text NOT NULL,
  disciplina text NOT NULL,
  tipo text NOT NULL,
  formato text NOT NULL,
  versao_atual text NOT NULL DEFAULT 'R00',
  data_revisao date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'elaboracao' CHECK (status IN ('elaboracao', 'revisao', 'aprovado', 'obsoleto')),
  responsavel_emissao text NOT NULL,
  responsavel_revisao text,
  cliente text NOT NULL,
  projeto text NOT NULL,
  observacoes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de arquivos dos documentos
CREATE TABLE public.document_files (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  version text NOT NULL DEFAULT 'R00',
  uploaded_by uuid,
  uploaded_at timestamptz DEFAULT now()
);

-- Tabela de GRDs
CREATE TABLE public.grds (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero text NOT NULL UNIQUE,
  cca text NOT NULL,
  folha text NOT NULL,
  data_envio date NOT NULL DEFAULT CURRENT_DATE,
  remetente text NOT NULL,
  destinatario text NOT NULL,
  observacoes text,
  created_at timestamptz DEFAULT now()
);

-- Tabela de documentos na GRD
CREATE TABLE public.grd_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grd_id uuid NOT NULL REFERENCES public.grds(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  discriminacao text NOT NULL,
  revisao text NOT NULL,
  numero_folhas integer NOT NULL DEFAULT 1,
  numero_copias integer NOT NULL DEFAULT 1,
  tipo_via text NOT NULL DEFAULT 'O' CHECK (tipo_via IN ('O', 'C', 'M', 'W'))
);

-- Tabela de providências da GRD
CREATE TABLE public.grd_providencias (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grd_id uuid NOT NULL REFERENCES public.grds(id) ON DELETE CASCADE,
  aprovar boolean DEFAULT false,
  arquivar boolean DEFAULT false,
  assinatura boolean DEFAULT false,
  comentar boolean DEFAULT false,
  devolver boolean DEFAULT false,
  informacao boolean DEFAULT false,
  revisar boolean DEFAULT false,
  liberado_construcao boolean DEFAULT false,
  liberado_detalhamento boolean DEFAULT false,
  liberado_comentarios boolean DEFAULT false,
  liberado_revisao boolean DEFAULT false,
  emitir_parecer boolean DEFAULT false,
  outros text
);

-- Tabela de distribuições
CREATE TABLE public.distributions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  grd_id uuid REFERENCES public.grds(id) ON DELETE SET NULL,
  destinatario text NOT NULL,
  email_destinatario text,
  data_envio timestamptz DEFAULT now(),
  data_recebimento timestamptz,
  status text NOT NULL DEFAULT 'enviado' CHECK (status IN ('enviado', 'recebido', 'confirmado')),
  observacoes text,
  token_confirmacao uuid DEFAULT gen_random_uuid()
);

-- Tabela de logs de importação
CREATE TABLE public.import_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename text NOT NULL,
  total_rows integer NOT NULL,
  success_count integer NOT NULL DEFAULT 0,
  error_count integer NOT NULL DEFAULT 0,
  errors jsonb,
  imported_by uuid,
  imported_at timestamptz DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grd_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grd_providencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acesso público por enquanto (até implementar autenticação)
CREATE POLICY "Allow all access to documents" ON public.documents FOR ALL USING (true);
CREATE POLICY "Allow all access to document_files" ON public.document_files FOR ALL USING (true);
CREATE POLICY "Allow all access to grds" ON public.grds FOR ALL USING (true);
CREATE POLICY "Allow all access to grd_documents" ON public.grd_documents FOR ALL USING (true);
CREATE POLICY "Allow all access to grd_providencias" ON public.grd_providencias FOR ALL USING (true);
CREATE POLICY "Allow all access to distributions" ON public.distributions FOR ALL USING (true);
CREATE POLICY "Allow all access to import_logs" ON public.import_logs FOR ALL USING (true);

-- Triggers para atualizar updated_at
CREATE TRIGGER update_documents_updated_at 
  BEFORE UPDATE ON public.documents 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_documents_numero ON public.documents(numero);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_disciplina ON public.documents(disciplina);
CREATE INDEX idx_document_files_document_id ON public.document_files(document_id);
CREATE INDEX idx_grds_numero ON public.grds(numero);
CREATE INDEX idx_distributions_document_id ON public.distributions(document_id);
CREATE INDEX idx_distributions_status ON public.distributions(status);

-- Criar storage bucket para documentos
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Políticas de storage para documentos
CREATE POLICY "Users can view documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Users can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Users can update documents" ON storage.objects FOR UPDATE USING (bucket_id = 'documents');
CREATE POLICY "Users can delete documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents');