-- ==========================================
-- ENGENHARIA MATRICIAL - ESTRUTURA DO BANCO DE DADOS
-- ==========================================

-- 1. ENUM para status da OS
CREATE TYPE os_status_enum AS ENUM (
  'aberta',
  'em-planejamento',
  'aguardando-aceite',
  'em-execucao',
  'aguardando-aceite-fechamento',
  'concluida',
  'cancelada',
  'rejeitada'
);

-- 2. TABELA PRINCIPAL: os_engenharia_matricial
CREATE TABLE public.os_engenharia_matricial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT,
  cca_id INTEGER REFERENCES public.ccas(id) ON DELETE RESTRICT,
  cliente TEXT NOT NULL DEFAULT '',
  disciplina TEXT NOT NULL,
  disciplinas_envolvidas TEXT[] NOT NULL DEFAULT '{}',
  familia_sao TEXT NOT NULL,
  descricao TEXT NOT NULL,
  status os_status_enum NOT NULL DEFAULT 'aberta',
  valor_orcamento NUMERIC NOT NULL DEFAULT 0,
  hh_planejado NUMERIC NOT NULL DEFAULT 0,
  hh_adicional NUMERIC NOT NULL DEFAULT 0,
  valor_hora_hh NUMERIC NOT NULL DEFAULT 95.00,
  data_compromissada DATE NOT NULL,
  data_inicio_prevista DATE,
  data_fim_prevista DATE,
  data_atendimento DATE,
  data_entrega_real DATE,
  data_conclusao DATE,
  valor_final NUMERIC,
  valor_sao NUMERIC,
  valor_engenharia NUMERIC,
  valor_suprimentos NUMERIC,
  justificativa_engenharia TEXT,
  percentual_saving NUMERIC,
  competencia TEXT NOT NULL DEFAULT '',
  responsavel_obra TEXT NOT NULL DEFAULT '',
  responsavel_em_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sla_status TEXT NOT NULL DEFAULT 'no-prazo',
  data_abertura DATE NOT NULL DEFAULT CURRENT_DATE,
  solicitante_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  solicitante_nome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 3. TABELA DE ANEXOS: os_anexos
CREATE TABLE public.os_anexos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  os_id UUID REFERENCES public.os_engenharia_matricial(id) ON DELETE CASCADE NOT NULL,
  nome_arquivo TEXT NOT NULL,
  url_arquivo TEXT NOT NULL,
  tamanho INTEGER,
  tipo_mime TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 4. TABELA DE REPLANEJAMENTOS: os_replanejamentos
CREATE TABLE public.os_replanejamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  os_id UUID REFERENCES public.os_engenharia_matricial(id) ON DELETE CASCADE NOT NULL,
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  hh_adicional NUMERIC NOT NULL,
  nova_data_inicio DATE NOT NULL,
  nova_data_fim DATE NOT NULL,
  motivo TEXT NOT NULL,
  usuario_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  usuario_nome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. TABELA DE HISTÓRICO HH: os_hh_historico
CREATE TABLE public.os_hh_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes TEXT NOT NULL,
  cca TEXT NOT NULL,
  cliente TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  hh_apropriado NUMERIC NOT NULL,
  meta_mensal NUMERIC NOT NULL,
  percentual_meta NUMERIC NOT NULL,
  status_meta TEXT NOT NULL CHECK (status_meta IN ('atingido', 'nao-atingido')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_os_cca_id ON public.os_engenharia_matricial(cca_id);
CREATE INDEX idx_os_status ON public.os_engenharia_matricial(status);
CREATE INDEX idx_os_solicitante_id ON public.os_engenharia_matricial(solicitante_id);
CREATE INDEX idx_os_responsavel_em_id ON public.os_engenharia_matricial(responsavel_em_id);
CREATE INDEX idx_os_data_abertura ON public.os_engenharia_matricial(data_abertura);
CREATE INDEX idx_os_cca_status_data ON public.os_engenharia_matricial(cca_id, status, data_abertura);
CREATE INDEX idx_os_anexos_os_id ON public.os_anexos(os_id);
CREATE INDEX idx_os_replanejamentos_os_id ON public.os_replanejamentos(os_id);
CREATE INDEX idx_os_hh_historico_mes ON public.os_hh_historico(mes);

-- 7. TRIGGERS PARA UPDATED_AT
CREATE TRIGGER set_updated_at_os_engenharia_matricial
  BEFORE UPDATE ON public.os_engenharia_matricial
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 8. TRIGGERS PARA AUDITORIA
CREATE TRIGGER set_created_by_os_engenharia_matricial
  BEFORE INSERT ON public.os_engenharia_matricial
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_updated_by_os_engenharia_matricial
  BEFORE UPDATE ON public.os_engenharia_matricial
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER set_created_by_os_anexos
  BEFORE INSERT ON public.os_anexos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

-- 9. FUNÇÃO PARA GERAR NÚMERO DA OS
CREATE OR REPLACE FUNCTION public.gerar_numero_os(p_cca_id INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ano TEXT;
  v_sequencia INTEGER;
  v_numero TEXT;
BEGIN
  v_ano := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SPLIT_PART(numero, '/', 1) AS INTEGER)), 0) + 1
  INTO v_sequencia
  FROM public.os_engenharia_matricial
  WHERE cca_id = p_cca_id
    AND numero LIKE '%/' || v_ano;
  
  v_numero := LPAD(v_sequencia::TEXT, 4, '0') || '/' || v_ano;
  
  RETURN v_numero;
END;
$$;

-- 10. HABILITAR ROW LEVEL SECURITY
ALTER TABLE public.os_engenharia_matricial ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_replanejamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_hh_historico ENABLE ROW LEVEL SECURITY;

-- 11. POLÍTICAS RLS PARA os_engenharia_matricial

-- SELECT: Usuários podem ver OS dos seus CCAs permitidos, suas próprias OS, ou OS onde são responsáveis
CREATE POLICY "OS - visualizar (autenticados com acesso)"
ON public.os_engenharia_matricial
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR cca_id = ANY(get_user_allowed_ccas(auth.uid()))
  OR solicitante_id = auth.uid()
  OR responsavel_em_id = auth.uid()
);

-- INSERT: Usuários autenticados podem criar OS nos CCAs permitidos
CREATE POLICY "OS - criar (autenticados com permissão)"
ON public.os_engenharia_matricial
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR 'engenharia_matricial_cadastro' = ANY(get_user_permissions(auth.uid()))
  OR cca_id = ANY(get_user_allowed_ccas(auth.uid()))
);

-- UPDATE: Solicitantes (status aberta), responsáveis EM, ou admins
CREATE POLICY "OS - atualizar (solicitante, responsável ou admin)"
ON public.os_engenharia_matricial
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR (solicitante_id = auth.uid() AND status = 'aberta')
  OR responsavel_em_id = auth.uid()
  OR 'engenharia_matricial_edicao' = ANY(get_user_permissions(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR (solicitante_id = auth.uid() AND status = 'aberta')
  OR responsavel_em_id = auth.uid()
  OR 'engenharia_matricial_edicao' = ANY(get_user_permissions(auth.uid()))
);

-- DELETE: Apenas admin sistema
CREATE POLICY "OS - deletar (apenas admin)"
ON public.os_engenharia_matricial
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
);

-- 12. POLÍTICAS RLS PARA os_anexos

CREATE POLICY "OS Anexos - visualizar (mesmas regras da OS)"
ON public.os_anexos
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.os_engenharia_matricial os
    WHERE os.id = os_anexos.os_id
    AND (
      has_role(auth.uid(), 'admin_sistema')
      OR '*' = ANY(get_user_permissions(auth.uid()))
      OR os.cca_id = ANY(get_user_allowed_ccas(auth.uid()))
      OR os.solicitante_id = auth.uid()
      OR os.responsavel_em_id = auth.uid()
    )
  )
);

CREATE POLICY "OS Anexos - criar (autenticados com acesso à OS)"
ON public.os_anexos
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.os_engenharia_matricial os
    WHERE os.id = os_anexos.os_id
    AND (
      has_role(auth.uid(), 'admin_sistema')
      OR '*' = ANY(get_user_permissions(auth.uid()))
      OR os.solicitante_id = auth.uid()
      OR os.responsavel_em_id = auth.uid()
    )
  )
);

CREATE POLICY "OS Anexos - deletar (criador ou admin)"
ON public.os_anexos
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR created_by = auth.uid()
);

-- 13. POLÍTICAS RLS PARA os_replanejamentos

CREATE POLICY "OS Replanejamentos - visualizar (mesmas regras da OS)"
ON public.os_replanejamentos
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.os_engenharia_matricial os
    WHERE os.id = os_replanejamentos.os_id
    AND (
      has_role(auth.uid(), 'admin_sistema')
      OR '*' = ANY(get_user_permissions(auth.uid()))
      OR os.cca_id = ANY(get_user_allowed_ccas(auth.uid()))
      OR os.solicitante_id = auth.uid()
      OR os.responsavel_em_id = auth.uid()
    )
  )
);

CREATE POLICY "OS Replanejamentos - criar (responsável EM ou admin)"
ON public.os_replanejamentos
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.os_engenharia_matricial os
    WHERE os.id = os_replanejamentos.os_id
    AND (
      has_role(auth.uid(), 'admin_sistema')
      OR '*' = ANY(get_user_permissions(auth.uid()))
      OR os.responsavel_em_id = auth.uid()
    )
  )
);

-- 14. POLÍTICAS RLS PARA os_hh_historico

CREATE POLICY "HH Histórico - visualizar (autenticados)"
ON public.os_hh_historico
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "HH Histórico - criar (autenticados com permissão)"
ON public.os_hh_historico
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR 'engenharia_matricial_cadastro' = ANY(get_user_permissions(auth.uid()))
);

CREATE POLICY "HH Histórico - atualizar (admin)"
ON public.os_hh_historico
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
);

CREATE POLICY "HH Histórico - deletar (admin)"
ON public.os_hh_historico
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
);

-- 15. STORAGE BUCKET PARA ANEXOS
INSERT INTO storage.buckets (id, name, public)
VALUES ('os-engenharia-matricial-anexos', 'os-engenharia-matricial-anexos', false)
ON CONFLICT (id) DO NOTHING;

-- 16. POLÍTICAS DE STORAGE

-- Visualizar: Usuários com acesso à OS
CREATE POLICY "OS Anexos Storage - visualizar (autenticados com acesso)"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'os-engenharia-matricial-anexos'
  AND (
    has_role(auth.uid(), 'admin_sistema')
    OR '*' = ANY(get_user_permissions(auth.uid()))
    OR auth.uid() IS NOT NULL
  )
);

-- Upload: Usuários autenticados
CREATE POLICY "OS Anexos Storage - upload (autenticados)"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'os-engenharia-matricial-anexos'
  AND (
    has_role(auth.uid(), 'admin_sistema')
    OR '*' = ANY(get_user_permissions(auth.uid()))
    OR auth.uid() IS NOT NULL
  )
);

-- Deletar: Apenas admin ou criador
CREATE POLICY "OS Anexos Storage - deletar (admin ou criador)"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'os-engenharia-matricial-anexos'
  AND (
    has_role(auth.uid(), 'admin_sistema')
    OR '*' = ANY(get_user_permissions(auth.uid()))
    OR owner = auth.uid()
  )
);