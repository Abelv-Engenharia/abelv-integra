-- ============================================================================
-- MÓDULO DOCUMENTAÇÃO SMS - FASE 1: ESTRUTURA BASE (CORRIGIDO)
-- ============================================================================

-- 1. CRIAR TABELA: documentacao_modelos
-- Templates de documentos (Word/Excel)
CREATE TABLE IF NOT EXISTS public.documentacao_modelos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR NOT NULL CHECK (tipo IN ('OS', 'TERMO_ALTURA', 'TERMO_ELETRICIDADE', 'TERMO_CONFINADO', 'LISTA_PRESENCA', 'CERTIFICADO')),
  nome VARCHAR NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  arquivo_nome VARCHAR NOT NULL,
  codigos_disponiveis JSONB NOT NULL DEFAULT '[]'::jsonb,
  ativo BOOLEAN DEFAULT TRUE,
  versao INTEGER DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CRIAR TABELA: documentacao_turmas (CORRIGIDO treinamento_id para UUID)
-- Turmas de treinamento para listas de presença
CREATE TABLE IF NOT EXISTS public.documentacao_turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR NOT NULL,
  treinamento_id UUID REFERENCES public.treinamentos(id),
  instrutor VARCHAR NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  carga_horaria INTEGER NOT NULL,
  local VARCHAR NOT NULL,
  cca_id INTEGER REFERENCES public.ccas(id),
  empresa_id INTEGER REFERENCES public.empresas(id),
  status VARCHAR DEFAULT 'ATIVA' CHECK (status IN ('ATIVA', 'CONCLUIDA', 'CANCELADA')),
  observacoes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CRIAR TABELA: documentacao_turmas_alunos
-- Alunos matriculados nas turmas
CREATE TABLE IF NOT EXISTS public.documentacao_turmas_alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id UUID REFERENCES public.documentacao_turmas(id) ON DELETE CASCADE,
  funcionario_id UUID REFERENCES public.funcionarios(id),
  presente BOOLEAN DEFAULT FALSE,
  nota DECIMAL(5,2),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CRIAR TABELA: documentacao_riscos_funcao
-- Riscos por função (para GRO e documentos)
CREATE TABLE IF NOT EXISTS public.documentacao_riscos_funcao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cca_id INTEGER NOT NULL REFERENCES public.ccas(id),
  empresa_id INTEGER NOT NULL REFERENCES public.empresas(id),
  funcao VARCHAR NOT NULL,
  cbo VARCHAR,
  descricao_funcao TEXT NOT NULL,
  riscos_fisicos JSONB DEFAULT '[]'::jsonb,
  riscos_quimicos JSONB DEFAULT '[]'::jsonb,
  riscos_biologicos JSONB DEFAULT '[]'::jsonb,
  riscos_ergonomicos JSONB DEFAULT '[]'::jsonb,
  riscos_acidentes JSONB DEFAULT '[]'::jsonb,
  epis_requeridos JSONB DEFAULT '[]'::jsonb,
  tecnico_responsavel_id UUID REFERENCES public.profiles(id),
  ativo BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CRIAR TABELA: documentacao_gerada
-- Histórico de documentos gerados
CREATE TABLE IF NOT EXISTS public.documentacao_gerada (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR NOT NULL,
  modelo_id UUID REFERENCES public.documentacao_modelos(id),
  arquivo_url TEXT NOT NULL,
  arquivo_nome VARCHAR NOT NULL,
  funcionario_id UUID REFERENCES public.funcionarios(id),
  turma_id UUID REFERENCES public.documentacao_turmas(id),
  risco_funcao_id UUID REFERENCES public.documentacao_riscos_funcao(id),
  cca_id INTEGER REFERENCES public.ccas(id),
  empresa_id INTEGER REFERENCES public.empresas(id),
  dados_preenchidos JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CRIAR STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('documentacao-modelos', 'documentacao-modelos', false),
  ('documentacao-gerada', 'documentacao-gerada', false)
ON CONFLICT (id) DO NOTHING;

-- 7. RLS POLICIES - documentacao_modelos
ALTER TABLE public.documentacao_modelos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modelos - visualizar (autenticados)"
ON public.documentacao_modelos FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Modelos - criar (autenticados com permissão)"
ON public.documentacao_modelos FOR INSERT
TO authenticated
WITH CHECK (
  'documentacao_modelos' = ANY(get_user_permissions(auth.uid())) OR
  has_role(auth.uid(), 'admin_sistema'::app_role) OR
  '*' = ANY(get_user_permissions(auth.uid()))
);

CREATE POLICY "Modelos - atualizar (autenticados com permissão)"
ON public.documentacao_modelos FOR UPDATE
TO authenticated
USING (
  'documentacao_modelos' = ANY(get_user_permissions(auth.uid())) OR
  has_role(auth.uid(), 'admin_sistema'::app_role) OR
  '*' = ANY(get_user_permissions(auth.uid()))
);

CREATE POLICY "Modelos - deletar (autenticados com permissão)"
ON public.documentacao_modelos FOR DELETE
TO authenticated
USING (
  'documentacao_modelos' = ANY(get_user_permissions(auth.uid())) OR
  has_role(auth.uid(), 'admin_sistema'::app_role) OR
  '*' = ANY(get_user_permissions(auth.uid()))
);

-- 8. RLS POLICIES - documentacao_turmas
ALTER TABLE public.documentacao_turmas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Turmas - visualizar (autenticados por CCA)"
ON public.documentacao_turmas FOR SELECT
TO authenticated
USING (
  cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR
  has_role(auth.uid(), 'admin_sistema'::app_role)
);

CREATE POLICY "Turmas - criar (autenticados com permissão)"
ON public.documentacao_turmas FOR INSERT
TO authenticated
WITH CHECK (
  ('documentacao_turmas' = ANY(get_user_permissions(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   '*' = ANY(get_user_permissions(auth.uid()))) AND
  (cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR has_role(auth.uid(), 'admin_sistema'::app_role))
);

CREATE POLICY "Turmas - atualizar (autenticados com permissão)"
ON public.documentacao_turmas FOR UPDATE
TO authenticated
USING (
  ('documentacao_turmas' = ANY(get_user_permissions(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   '*' = ANY(get_user_permissions(auth.uid()))) AND
  (cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR has_role(auth.uid(), 'admin_sistema'::app_role))
);

CREATE POLICY "Turmas - deletar (autenticados com permissão)"
ON public.documentacao_turmas FOR DELETE
TO authenticated
USING (
  ('documentacao_turmas' = ANY(get_user_permissions(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   '*' = ANY(get_user_permissions(auth.uid()))) AND
  (cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR has_role(auth.uid(), 'admin_sistema'::app_role))
);

-- 9. RLS POLICIES - documentacao_turmas_alunos
ALTER TABLE public.documentacao_turmas_alunos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alunos turma - visualizar (autenticados)"
ON public.documentacao_turmas_alunos FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.documentacao_turmas t
    WHERE t.id = turma_id AND (
      t.cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR
      has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  )
);

CREATE POLICY "Alunos turma - gerenciar (autenticados com permissão)"
ON public.documentacao_turmas_alunos FOR ALL
TO authenticated
USING (
  ('documentacao_turmas' = ANY(get_user_permissions(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   '*' = ANY(get_user_permissions(auth.uid()))) AND
  EXISTS (
    SELECT 1 FROM public.documentacao_turmas t
    WHERE t.id = turma_id AND (
      t.cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR
      has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  )
)
WITH CHECK (
  ('documentacao_turmas' = ANY(get_user_permissions(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   '*' = ANY(get_user_permissions(auth.uid()))) AND
  EXISTS (
    SELECT 1 FROM public.documentacao_turmas t
    WHERE t.id = turma_id AND (
      t.cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR
      has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  )
);

-- 10. RLS POLICIES - documentacao_riscos_funcao
ALTER TABLE public.documentacao_riscos_funcao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Riscos função - visualizar (autenticados por CCA)"
ON public.documentacao_riscos_funcao FOR SELECT
TO authenticated
USING (
  cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR
  has_role(auth.uid(), 'admin_sistema'::app_role)
);

CREATE POLICY "Riscos função - criar (autenticados com permissão)"
ON public.documentacao_riscos_funcao FOR INSERT
TO authenticated
WITH CHECK (
  ('documentacao_riscos' = ANY(get_user_permissions(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   '*' = ANY(get_user_permissions(auth.uid()))) AND
  (cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR has_role(auth.uid(), 'admin_sistema'::app_role))
);

CREATE POLICY "Riscos função - atualizar (autenticados com permissão)"
ON public.documentacao_riscos_funcao FOR UPDATE
TO authenticated
USING (
  ('documentacao_riscos' = ANY(get_user_permissions(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   '*' = ANY(get_user_permissions(auth.uid()))) AND
  (cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR has_role(auth.uid(), 'admin_sistema'::app_role))
);

CREATE POLICY "Riscos função - deletar (autenticados com permissão)"
ON public.documentacao_riscos_funcao FOR DELETE
TO authenticated
USING (
  ('documentacao_riscos' = ANY(get_user_permissions(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   '*' = ANY(get_user_permissions(auth.uid()))) AND
  (cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR has_role(auth.uid(), 'admin_sistema'::app_role))
);

-- 11. RLS POLICIES - documentacao_gerada
ALTER TABLE public.documentacao_gerada ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Documentos gerados - visualizar (autenticados por CCA)"
ON public.documentacao_gerada FOR SELECT
TO authenticated
USING (
  (cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   created_by = auth.uid())
);

CREATE POLICY "Documentos gerados - criar (autenticados)"
ON public.documentacao_gerada FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  (cca_id = ANY(get_user_allowed_ccas(auth.uid())) OR has_role(auth.uid(), 'admin_sistema'::app_role))
);

-- 12. RLS POLICIES - Storage Buckets
CREATE POLICY "Modelos storage - visualizar (autenticados)"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documentacao-modelos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Modelos storage - upload (autenticados com permissão)"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentacao-modelos' AND
  ('documentacao_modelos' = ANY(get_user_permissions(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   '*' = ANY(get_user_permissions(auth.uid())))
);

CREATE POLICY "Modelos storage - atualizar (autenticados com permissão)"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documentacao-modelos' AND
  ('documentacao_modelos' = ANY(get_user_permissions(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   '*' = ANY(get_user_permissions(auth.uid())))
);

CREATE POLICY "Modelos storage - deletar (autenticados com permissão)"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documentacao-modelos' AND
  ('documentacao_modelos' = ANY(get_user_permissions(auth.uid())) OR
   has_role(auth.uid(), 'admin_sistema'::app_role) OR
   '*' = ANY(get_user_permissions(auth.uid())))
);

CREATE POLICY "Documentos gerados storage - visualizar (criador ou admin)"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentacao-gerada' AND
  (owner = auth.uid() OR has_role(auth.uid(), 'admin_sistema'::app_role))
);

CREATE POLICY "Documentos gerados storage - criar (autenticados)"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentacao-gerada' AND
  auth.uid() IS NOT NULL
);

-- 13. TRIGGERS para updated_at
CREATE TRIGGER update_documentacao_modelos_updated_at
BEFORE UPDATE ON public.documentacao_modelos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documentacao_turmas_updated_at
BEFORE UPDATE ON public.documentacao_turmas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documentacao_riscos_funcao_updated_at
BEFORE UPDATE ON public.documentacao_riscos_funcao
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. ÍNDICES para performance
CREATE INDEX idx_documentacao_modelos_tipo ON public.documentacao_modelos(tipo);
CREATE INDEX idx_documentacao_modelos_ativo ON public.documentacao_modelos(ativo);
CREATE INDEX idx_documentacao_turmas_cca ON public.documentacao_turmas(cca_id);
CREATE INDEX idx_documentacao_turmas_status ON public.documentacao_turmas(status);
CREATE INDEX idx_documentacao_turmas_alunos_turma ON public.documentacao_turmas_alunos(turma_id);
CREATE INDEX idx_documentacao_turmas_alunos_funcionario ON public.documentacao_turmas_alunos(funcionario_id);
CREATE INDEX idx_documentacao_riscos_cca ON public.documentacao_riscos_funcao(cca_id);
CREATE INDEX idx_documentacao_riscos_funcao_nome ON public.documentacao_riscos_funcao(funcao);
CREATE INDEX idx_documentacao_gerada_tipo ON public.documentacao_gerada(tipo);
CREATE INDEX idx_documentacao_gerada_cca ON public.documentacao_gerada(cca_id);
CREATE INDEX idx_documentacao_gerada_created_by ON public.documentacao_gerada(created_by);