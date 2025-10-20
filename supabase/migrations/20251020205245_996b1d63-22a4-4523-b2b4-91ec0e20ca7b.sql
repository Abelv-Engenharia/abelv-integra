-- =====================================================
-- MÓDULO DE SOLICITAÇÕES DE SERVIÇOS - MIGRATION COMPLETA
-- =====================================================

-- 1. CRIAR ENUMS
-- =====================================================

CREATE TYPE tipo_servico_enum AS ENUM (
  'voucher_uber',
  'locacao_veiculo',
  'cartao_abastecimento',
  'veloe_go',
  'passagens',
  'hospedagem',
  'logistica',
  'correios_loggi'
);

CREATE TYPE status_solicitacao_enum AS ENUM (
  'pendente',
  'aprovado',
  'em_andamento',
  'aguardando_aprovacao',
  'concluido',
  'rejeitado'
);

CREATE TYPE prioridade_solicitacao_enum AS ENUM (
  'baixa',
  'media',
  'alta'
);

-- 2. TABELA PRINCIPAL: solicitacoes_servicos
-- =====================================================

CREATE TABLE public.solicitacoes_servicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados do solicitante
  solicitante_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  solicitante_nome text NOT NULL,
  
  -- Dados básicos da solicitação
  data_solicitacao timestamptz NOT NULL DEFAULT now(),
  tipo_servico tipo_servico_enum NOT NULL,
  status status_solicitacao_enum NOT NULL DEFAULT 'em_andamento',
  prioridade prioridade_solicitacao_enum NOT NULL DEFAULT 'media',
  cca_id integer REFERENCES public.ccas(id) ON DELETE SET NULL,
  observacoes text,
  
  -- Campos de gestão
  observacoes_gestao text,
  imagem_anexo text,
  estimativa_valor numeric(10,2),
  responsavel_aprovacao_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Campos de aprovação
  justificativa_aprovacao text,
  justificativa_reprovacao text,
  data_aprovacao timestamptz,
  aprovado_por_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Campos de conclusão
  observacoes_conclusao text,
  comprovante_conclusao text,
  data_conclusao timestamptz,
  concluido_por_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Auditoria de movimentação automática
  status_anterior status_solicitacao_enum,
  data_mudanca_automatica timestamptz,
  motivo_mudanca_automatica text,
  foi_movido_automaticamente boolean DEFAULT false,
  
  -- Metadados
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. TABELA: solicitacoes_dados_especificos
-- =====================================================

CREATE TABLE public.solicitacoes_dados_especificos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitacao_id uuid REFERENCES public.solicitacoes_servicos(id) ON DELETE CASCADE NOT NULL UNIQUE,
  dados jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. TABELA: solicitacoes_historico
-- =====================================================

CREATE TABLE public.solicitacoes_historico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitacao_id uuid REFERENCES public.solicitacoes_servicos(id) ON DELETE CASCADE NOT NULL,
  status_anterior status_solicitacao_enum,
  status_novo status_solicitacao_enum NOT NULL,
  usuario_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  usuario_nome text,
  motivo text,
  automatico boolean DEFAULT false,
  data_mudanca timestamptz NOT NULL DEFAULT now(),
  detalhes jsonb DEFAULT '{}'
);

-- 5. TABELA: solicitacoes_viajantes
-- =====================================================

CREATE TABLE public.solicitacoes_viajantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitacao_id uuid REFERENCES public.solicitacoes_servicos(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  cpf varchar(14) NOT NULL,
  rg varchar(20) NOT NULL,
  data_nascimento date NOT NULL,
  telefone varchar(20) NOT NULL,
  email varchar(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_solicitacoes_solicitante ON public.solicitacoes_servicos(solicitante_id);
CREATE INDEX idx_solicitacoes_cca ON public.solicitacoes_servicos(cca_id);
CREATE INDEX idx_solicitacoes_status ON public.solicitacoes_servicos(status);
CREATE INDEX idx_solicitacoes_tipo_servico ON public.solicitacoes_servicos(tipo_servico);
CREATE INDEX idx_solicitacoes_data ON public.solicitacoes_servicos(data_solicitacao DESC);
CREATE INDEX idx_solicitacoes_historico_sol ON public.solicitacoes_historico(solicitacao_id);
CREATE INDEX idx_solicitacoes_viajantes_sol ON public.solicitacoes_viajantes(solicitacao_id);

-- 7. FUNÇÕES SECURITY DEFINER
-- =====================================================

-- Verificar se usuário pode gerenciar solicitações
CREATE OR REPLACE FUNCTION public.user_can_manage_solicitacoes(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admin sistema tem acesso total
  IF public.has_role(user_id_param, 'admin_sistema') THEN
    RETURN true;
  END IF;
  
  -- Verificar permissões específicas
  IF 'solicitacoes_gestao'::text = ANY(get_user_permissions(user_id_param)) THEN
    RETURN true;
  END IF;
  
  -- Verificar permissão global
  IF '*'::text = ANY(get_user_permissions(user_id_param)) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 8. TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at
CREATE TRIGGER set_updated_at_solicitacoes
BEFORE UPDATE ON public.solicitacoes_servicos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_dados_especificos
BEFORE UPDATE ON public.solicitacoes_dados_especificos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para setar created_by e updated_by
CREATE TRIGGER set_created_by_solicitacoes
BEFORE INSERT ON public.solicitacoes_servicos
FOR EACH ROW
EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_updated_by_solicitacoes
BEFORE UPDATE ON public.solicitacoes_servicos
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_by();

-- Trigger para registrar mudanças de status no histórico
CREATE OR REPLACE FUNCTION public.log_solicitacao_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_usuario_nome text;
BEGIN
  -- Buscar nome do usuário
  SELECT nome INTO v_usuario_nome
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  -- Registrar no histórico apenas se o status mudou
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.solicitacoes_historico (
      solicitacao_id,
      status_anterior,
      status_novo,
      usuario_id,
      usuario_nome,
      motivo,
      automatico,
      data_mudanca,
      detalhes
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid(),
      COALESCE(v_usuario_nome, 'Sistema'),
      COALESCE(NEW.motivo_mudanca_automatica, 'Mudança manual de status'),
      COALESCE(NEW.foi_movido_automaticamente, false),
      now(),
      jsonb_build_object(
        'observacoes_gestao', NEW.observacoes_gestao,
        'justificativa_aprovacao', NEW.justificativa_aprovacao,
        'justificativa_reprovacao', NEW.justificativa_reprovacao
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER log_status_change_solicitacoes
AFTER UPDATE OF status ON public.solicitacoes_servicos
FOR EACH ROW
EXECUTE FUNCTION public.log_solicitacao_status_change();

-- 9. HABILITAR RLS
-- =====================================================

ALTER TABLE public.solicitacoes_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_dados_especificos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_viajantes ENABLE ROW LEVEL SECURITY;

-- 10. POLÍTICAS RLS - solicitacoes_servicos
-- =====================================================

-- SELECT: Usuário vê suas próprias solicitações + gestores veem do CCA
CREATE POLICY "Visualizar próprias solicitações ou do CCA"
ON public.solicitacoes_servicos
FOR SELECT
TO authenticated
USING (
  auth.uid() = solicitante_id 
  OR user_can_manage_solicitacoes(auth.uid())
  OR cca_id = ANY(get_user_allowed_ccas(auth.uid()))
);

-- INSERT: Qualquer usuário autenticado pode criar
CREATE POLICY "Criar solicitações"
ON public.solicitacoes_servicos
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = solicitante_id
  AND auth.uid() IS NOT NULL
);

-- UPDATE: Solicitante pode editar (antes da aprovação) ou gestores
CREATE POLICY "Atualizar solicitações"
ON public.solicitacoes_servicos
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = solicitante_id AND status IN ('em_andamento', 'pendente'))
  OR user_can_manage_solicitacoes(auth.uid())
  OR cca_id = ANY(get_user_allowed_ccas(auth.uid()))
)
WITH CHECK (
  (auth.uid() = solicitante_id AND status IN ('em_andamento', 'pendente'))
  OR user_can_manage_solicitacoes(auth.uid())
  OR cca_id = ANY(get_user_allowed_ccas(auth.uid()))
);

-- DELETE: Apenas o solicitante pode deletar (antes da aprovação)
CREATE POLICY "Deletar solicitações"
ON public.solicitacoes_servicos
FOR DELETE
TO authenticated
USING (
  auth.uid() = solicitante_id 
  AND status IN ('em_andamento', 'pendente')
);

-- 11. POLÍTICAS RLS - solicitacoes_dados_especificos
-- =====================================================

CREATE POLICY "Visualizar dados específicos"
ON public.solicitacoes_dados_especificos
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.solicitacoes_servicos s
    WHERE s.id = solicitacao_id
    AND (
      s.solicitante_id = auth.uid()
      OR user_can_manage_solicitacoes(auth.uid())
      OR s.cca_id = ANY(get_user_allowed_ccas(auth.uid()))
    )
  )
);

CREATE POLICY "Inserir dados específicos"
ON public.solicitacoes_dados_especificos
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.solicitacoes_servicos s
    WHERE s.id = solicitacao_id
    AND s.solicitante_id = auth.uid()
  )
);

CREATE POLICY "Atualizar dados específicos"
ON public.solicitacoes_dados_especificos
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.solicitacoes_servicos s
    WHERE s.id = solicitacao_id
    AND (
      (s.solicitante_id = auth.uid() AND s.status IN ('em_andamento', 'pendente'))
      OR user_can_manage_solicitacoes(auth.uid())
      OR s.cca_id = ANY(get_user_allowed_ccas(auth.uid()))
    )
  )
);

CREATE POLICY "Deletar dados específicos"
ON public.solicitacoes_dados_especificos
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.solicitacoes_servicos s
    WHERE s.id = solicitacao_id
    AND s.solicitante_id = auth.uid()
    AND s.status IN ('em_andamento', 'pendente')
  )
);

-- 12. POLÍTICAS RLS - solicitacoes_historico
-- =====================================================

CREATE POLICY "Visualizar histórico"
ON public.solicitacoes_historico
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.solicitacoes_servicos s
    WHERE s.id = solicitacao_id
    AND (
      s.solicitante_id = auth.uid()
      OR user_can_manage_solicitacoes(auth.uid())
      OR s.cca_id = ANY(get_user_allowed_ccas(auth.uid()))
    )
  )
);

CREATE POLICY "Inserir histórico"
ON public.solicitacoes_historico
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- 13. POLÍTICAS RLS - solicitacoes_viajantes
-- =====================================================

CREATE POLICY "Visualizar viajantes"
ON public.solicitacoes_viajantes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.solicitacoes_servicos s
    WHERE s.id = solicitacao_id
    AND (
      s.solicitante_id = auth.uid()
      OR user_can_manage_solicitacoes(auth.uid())
      OR s.cca_id = ANY(get_user_allowed_ccas(auth.uid()))
    )
  )
);

CREATE POLICY "Gerenciar viajantes"
ON public.solicitacoes_viajantes
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.solicitacoes_servicos s
    WHERE s.id = solicitacao_id
    AND (
      (s.solicitante_id = auth.uid() AND s.status IN ('em_andamento', 'pendente'))
      OR user_can_manage_solicitacoes(auth.uid())
      OR s.cca_id = ANY(get_user_allowed_ccas(auth.uid()))
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.solicitacoes_servicos s
    WHERE s.id = solicitacao_id
    AND (
      (s.solicitante_id = auth.uid() AND s.status IN ('em_andamento', 'pendente'))
      OR user_can_manage_solicitacoes(auth.uid())
      OR s.cca_id = ANY(get_user_allowed_ccas(auth.uid()))
    )
  )
);

-- 14. VIEW: v_solicitacoes_completas
-- =====================================================

CREATE OR REPLACE VIEW public.v_solicitacoes_completas AS
SELECT 
  s.*,
  se.dados as dados_especificos,
  p.nome as solicitante_nome_profile,
  c.nome as cca_nome,
  c.codigo as cca_codigo,
  COUNT(DISTINCT h.id) as total_mudancas_status,
  COUNT(DISTINCT v.id) as total_viajantes
FROM public.solicitacoes_servicos s
LEFT JOIN public.solicitacoes_dados_especificos se ON s.id = se.solicitacao_id
LEFT JOIN public.profiles p ON s.solicitante_id = p.id
LEFT JOIN public.ccas c ON s.cca_id = c.id
LEFT JOIN public.solicitacoes_historico h ON s.id = h.solicitacao_id
LEFT JOIN public.solicitacoes_viajantes v ON s.id = v.solicitacao_id
GROUP BY s.id, se.dados, p.nome, c.nome, c.codigo;

-- 15. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE public.solicitacoes_servicos IS 'Tabela principal de solicitações de serviços (Gestão de Pessoas)';
COMMENT ON TABLE public.solicitacoes_dados_especificos IS 'Dados específicos de cada tipo de serviço em formato JSONB';
COMMENT ON TABLE public.solicitacoes_historico IS 'Histórico completo de mudanças de status';
COMMENT ON TABLE public.solicitacoes_viajantes IS 'Viajantes para solicitações de passagens';
COMMENT ON COLUMN public.solicitacoes_servicos.foi_movido_automaticamente IS 'Indica se a solicitação foi movida automaticamente após 3 dias úteis';
COMMENT ON FUNCTION public.user_can_manage_solicitacoes IS 'Verifica se usuário tem permissão para gerenciar solicitações';