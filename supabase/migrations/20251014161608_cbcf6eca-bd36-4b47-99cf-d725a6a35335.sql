-- Criar bucket de storage para documentos do repositório
INSERT INTO storage.buckets (id, name, public)
VALUES ('repositorio-documentos', 'repositorio-documentos', false)
ON CONFLICT (id) DO NOTHING;

-- Tabela de categorias do repositório
CREATE TABLE IF NOT EXISTS public.repositorio_categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  icone TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(nome)
);

-- Tabela de subcategorias do repositório
CREATE TABLE IF NOT EXISTS public.repositorio_subcategorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID REFERENCES public.repositorio_categorias(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(categoria_id, nome)
);

-- Tabela de documentos do repositório
CREATE TABLE IF NOT EXISTS public.repositorio_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID REFERENCES public.repositorio_categorias(id) ON DELETE RESTRICT NOT NULL,
  subcategoria_id UUID REFERENCES public.repositorio_subcategorias(id) ON DELETE RESTRICT NOT NULL,
  nome_arquivo TEXT NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  arquivo_nome_original TEXT NOT NULL,
  arquivo_tamanho BIGINT,
  arquivo_tipo TEXT,
  data_validade DATE NOT NULL,
  responsavel_id UUID REFERENCES auth.users(id) NOT NULL,
  responsavel_nome TEXT NOT NULL,
  responsavel_email TEXT NOT NULL,
  empresa_id INTEGER REFERENCES public.empresas(id),
  cca_id INTEGER REFERENCES public.ccas(id),
  versao INTEGER DEFAULT 1,
  documento_pai_id UUID REFERENCES public.repositorio_documentos(id),
  status TEXT DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'ARQUIVADO', 'VENCIDO')),
  tags TEXT[],
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de histórico de acessos aos documentos
CREATE TABLE IF NOT EXISTS public.repositorio_documentos_acessos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  documento_id UUID REFERENCES public.repositorio_documentos(id) ON DELETE CASCADE NOT NULL,
  usuario_id UUID REFERENCES auth.users(id) NOT NULL,
  usuario_nome TEXT,
  tipo_acesso TEXT DEFAULT 'VISUALIZACAO' CHECK (tipo_acesso IN ('VISUALIZACAO', 'DOWNLOAD', 'EDICAO')),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_repositorio_subcategorias_categoria ON public.repositorio_subcategorias(categoria_id);
CREATE INDEX IF NOT EXISTS idx_repositorio_documentos_categoria ON public.repositorio_documentos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_repositorio_documentos_subcategoria ON public.repositorio_documentos(subcategoria_id);
CREATE INDEX IF NOT EXISTS idx_repositorio_documentos_responsavel ON public.repositorio_documentos(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_repositorio_documentos_validade ON public.repositorio_documentos(data_validade);
CREATE INDEX IF NOT EXISTS idx_repositorio_documentos_status ON public.repositorio_documentos(status);
CREATE INDEX IF NOT EXISTS idx_repositorio_acessos_documento ON public.repositorio_documentos_acessos(documento_id);
CREATE INDEX IF NOT EXISTS idx_repositorio_acessos_usuario ON public.repositorio_documentos_acessos(usuario_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_repositorio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_repositorio_categorias_updated_at
  BEFORE UPDATE ON public.repositorio_categorias
  FOR EACH ROW
  EXECUTE FUNCTION update_repositorio_updated_at();

CREATE TRIGGER update_repositorio_subcategorias_updated_at
  BEFORE UPDATE ON public.repositorio_subcategorias
  FOR EACH ROW
  EXECUTE FUNCTION update_repositorio_updated_at();

CREATE TRIGGER update_repositorio_documentos_updated_at
  BEFORE UPDATE ON public.repositorio_documentos
  FOR EACH ROW
  EXECUTE FUNCTION update_repositorio_updated_at();

-- Trigger para definir created_by automaticamente
CREATE TRIGGER set_repositorio_categorias_created_by
  BEFORE INSERT ON public.repositorio_categorias
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

CREATE TRIGGER set_repositorio_subcategorias_created_by
  BEFORE INSERT ON public.repositorio_subcategorias
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

CREATE TRIGGER set_repositorio_documentos_created_by
  BEFORE INSERT ON public.repositorio_documentos
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

-- Trigger para definir updated_by automaticamente
CREATE TRIGGER set_repositorio_documentos_updated_by
  BEFORE UPDATE ON public.repositorio_documentos
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_by();

-- Habilitar RLS
ALTER TABLE public.repositorio_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repositorio_subcategorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repositorio_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repositorio_documentos_acessos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categorias
CREATE POLICY "Categorias - visualizar (autenticados)"
  ON public.repositorio_categorias FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL AND ativo = true);

CREATE POLICY "Categorias - gerenciar (autenticados com permissão)"
  ON public.repositorio_categorias FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin_sistema'::app_role) OR
    '*' = ANY(get_user_permissions(auth.uid())) OR
    'repositorio_admin' = ANY(get_user_permissions(auth.uid()))
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin_sistema'::app_role) OR
    '*' = ANY(get_user_permissions(auth.uid())) OR
    'repositorio_admin' = ANY(get_user_permissions(auth.uid()))
  );

-- Políticas RLS para subcategorias
CREATE POLICY "Subcategorias - visualizar (autenticados)"
  ON public.repositorio_subcategorias FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL AND ativo = true);

CREATE POLICY "Subcategorias - gerenciar (autenticados com permissão)"
  ON public.repositorio_subcategorias FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin_sistema'::app_role) OR
    '*' = ANY(get_user_permissions(auth.uid())) OR
    'repositorio_admin' = ANY(get_user_permissions(auth.uid()))
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin_sistema'::app_role) OR
    '*' = ANY(get_user_permissions(auth.uid())) OR
    'repositorio_admin' = ANY(get_user_permissions(auth.uid()))
  );

-- Políticas RLS para documentos
CREATE POLICY "Documentos - visualizar (autenticados)"
  ON public.repositorio_documentos FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL AND ativo = true);

CREATE POLICY "Documentos - criar (autenticados)"
  ON public.repositorio_documentos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Documentos - atualizar (criador ou admin)"
  ON public.repositorio_documentos FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    responsavel_id = auth.uid() OR
    has_role(auth.uid(), 'admin_sistema'::app_role) OR
    '*' = ANY(get_user_permissions(auth.uid())) OR
    'repositorio_admin' = ANY(get_user_permissions(auth.uid()))
  )
  WITH CHECK (
    created_by = auth.uid() OR
    responsavel_id = auth.uid() OR
    has_role(auth.uid(), 'admin_sistema'::app_role) OR
    '*' = ANY(get_user_permissions(auth.uid())) OR
    'repositorio_admin' = ANY(get_user_permissions(auth.uid()))
  );

CREATE POLICY "Documentos - deletar (criador ou admin)"
  ON public.repositorio_documentos FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    responsavel_id = auth.uid() OR
    has_role(auth.uid(), 'admin_sistema'::app_role) OR
    '*' = ANY(get_user_permissions(auth.uid())) OR
    'repositorio_admin' = ANY(get_user_permissions(auth.uid()))
  );

-- Políticas RLS para acessos
CREATE POLICY "Acessos - visualizar próprios (autenticados)"
  ON public.repositorio_documentos_acessos FOR SELECT
  TO authenticated
  USING (
    usuario_id = auth.uid() OR
    has_role(auth.uid(), 'admin_sistema'::app_role) OR
    '*' = ANY(get_user_permissions(auth.uid())) OR
    'repositorio_admin' = ANY(get_user_permissions(auth.uid()))
  );

CREATE POLICY "Acessos - registrar (autenticados)"
  ON public.repositorio_documentos_acessos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas de storage para bucket repositorio-documentos
CREATE POLICY "Documentos - upload (autenticados)"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'repositorio-documentos' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Documentos - visualizar/download (autenticados)"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'repositorio-documentos' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Documentos - atualizar (criador ou admin)"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'repositorio-documentos' AND (
      (storage.foldername(name))[1] = auth.uid()::text OR
      has_role(auth.uid(), 'admin_sistema'::app_role) OR
      '*' = ANY(get_user_permissions(auth.uid())) OR
      'repositorio_admin' = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Documentos - deletar (criador ou admin)"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'repositorio-documentos' AND (
      (storage.foldername(name))[1] = auth.uid()::text OR
      has_role(auth.uid(), 'admin_sistema'::app_role) OR
      '*' = ANY(get_user_permissions(auth.uid())) OR
      'repositorio_admin' = ANY(get_user_permissions(auth.uid()))
    )
  );

-- Inserir categorias iniciais (baseado no mock)
INSERT INTO public.repositorio_categorias (nome, descricao, icone, ordem) VALUES
  ('Contratos', 'Contratos e acordos comerciais', 'FileText', 1),
  ('Propostas', 'Propostas comerciais e orçamentos', 'FileCheck', 2),
  ('Documentação Legal', 'Documentos legais e jurídicos', 'Scale', 3),
  ('Relatórios', 'Relatórios e análises', 'BarChart', 4),
  ('Apresentações', 'Apresentações e materiais de marketing', 'Presentation', 5),
  ('Outros', 'Documentos diversos', 'Folder', 99)
ON CONFLICT (nome) DO NOTHING;

COMMENT ON TABLE public.repositorio_categorias IS 'Categorias de documentos do repositório comercial';
COMMENT ON TABLE public.repositorio_subcategorias IS 'Subcategorias de documentos do repositório comercial';
COMMENT ON TABLE public.repositorio_documentos IS 'Documentos armazenados no repositório comercial';
COMMENT ON TABLE public.repositorio_documentos_acessos IS 'Histórico de acessos aos documentos do repositório';