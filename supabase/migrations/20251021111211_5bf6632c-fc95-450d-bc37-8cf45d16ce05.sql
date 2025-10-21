-- =====================================================
-- MÓDULO: RECRUTAMENTO E SELEÇÃO
-- Estrutura completa do banco de dados
-- =====================================================

-- =====================================================
-- 1. TABELA: recrutamento_vagas
-- =====================================================
CREATE TABLE IF NOT EXISTS public.recrutamento_vagas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_vaga text NOT NULL,
  cargo text NOT NULL,
  area text NOT NULL,
  setor text NOT NULL,
  cca_id integer NOT NULL,
  cca_codigo text NOT NULL,
  cca_nome text NOT NULL,
  local_trabalho text NOT NULL,
  gestor_responsavel text NOT NULL,
  gestor_responsavel_id uuid,
  motivo_abertura text NOT NULL,
  nome_colaborador_substituido text,
  prazo_mobilizacao date NOT NULL,
  tipo_contrato text NOT NULL,
  jornada_trabalho text NOT NULL,
  faixa_salarial text NOT NULL,
  beneficios text,
  formacao_minima text NOT NULL,
  experiencia_desejada text NOT NULL,
  hard_skills text[] DEFAULT '{}',
  soft_skills text[] DEFAULT '{}',
  aprovador text NOT NULL,
  aprovador_id uuid,
  status_aprovacao text NOT NULL DEFAULT 'pendente',
  justificativa_reprovacao text,
  data_aprovacao timestamp with time zone,
  status text NOT NULL DEFAULT 'solicitacao_aberta',
  prioridade text NOT NULL DEFAULT 'media',
  etapa_atual text,
  observacoes text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  
  CONSTRAINT uq_recrutamento_vagas_numero UNIQUE (numero_vaga),
  CONSTRAINT ck_recrutamento_vagas_status_aprovacao CHECK (status_aprovacao IN ('pendente', 'aprovado', 'reprovado')),
  CONSTRAINT ck_recrutamento_vagas_status CHECK (status IN ('solicitacao_aberta', 'aprovada', 'divulgacao_feita', 'em_selecao', 'finalizada')),
  CONSTRAINT ck_recrutamento_vagas_prioridade CHECK (prioridade IN ('baixa', 'media', 'alta')),
  CONSTRAINT ck_recrutamento_vagas_motivo CHECK (motivo_abertura IN ('substituicao', 'nova_obra', 'aumento_equipe')),
  CONSTRAINT ck_recrutamento_vagas_contrato CHECK (tipo_contrato IN ('clt', 'pj', 'aprendiz', 'estagio'))
);

-- Índices para recrutamento_vagas
CREATE INDEX idx_recrutamento_vagas_numero ON public.recrutamento_vagas(numero_vaga);
CREATE INDEX idx_recrutamento_vagas_cca ON public.recrutamento_vagas(cca_id);
CREATE INDEX idx_recrutamento_vagas_status ON public.recrutamento_vagas(status);
CREATE INDEX idx_recrutamento_vagas_status_aprovacao ON public.recrutamento_vagas(status_aprovacao);
CREATE INDEX idx_recrutamento_vagas_prioridade ON public.recrutamento_vagas(prioridade);
CREATE INDEX idx_recrutamento_vagas_cargo ON public.recrutamento_vagas(cargo);
CREATE INDEX idx_recrutamento_vagas_etapa_atual ON public.recrutamento_vagas(etapa_atual);
CREATE INDEX idx_recrutamento_vagas_prazo ON public.recrutamento_vagas(prazo_mobilizacao);
CREATE INDEX idx_recrutamento_vagas_ativo ON public.recrutamento_vagas(ativo);

-- =====================================================
-- 2. TABELA: recrutamento_candidatos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.recrutamento_candidatos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo text NOT NULL,
  cpf varchar(14),
  telefone varchar(15) NOT NULL,
  email text NOT NULL,
  cidade_estado text NOT NULL,
  cargo_vaga_pretendida text NOT NULL,
  cca_id integer,
  cca_codigo text,
  cca_nome text,
  origem_candidato text NOT NULL,
  data_cadastro date NOT NULL DEFAULT CURRENT_DATE,
  data_entrevista date,
  etapa_processo text NOT NULL DEFAULT 'Triagem Curricular',
  responsavel_etapa text NOT NULL,
  responsavel_etapa_id uuid,
  feedback_gestor_rh text,
  motivo_nao_contratacao text,
  status_candidato text NOT NULL DEFAULT 'Disponível',
  data_ultima_atualizacao date NOT NULL DEFAULT CURRENT_DATE,
  possibilidade_reaproveitamento boolean DEFAULT true,
  faixa_salarial text,
  observacoes_gerais text,
  curriculo_url text,
  curriculo_nome text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  
  CONSTRAINT uq_recrutamento_candidatos_cpf UNIQUE (cpf),
  CONSTRAINT ck_recrutamento_candidatos_status CHECK (status_candidato IN ('Disponível', 'Em outro processo', 'Contratado', 'Não disponível')),
  CONSTRAINT ck_recrutamento_candidatos_origem CHECK (origem_candidato IN ('LinkedIn', 'Indeed', 'Indicação', 'Site da Abelv', 'Solides', 'WhatsApp', 'Outros'))
);

-- Índices para recrutamento_candidatos
CREATE INDEX idx_recrutamento_candidatos_nome ON public.recrutamento_candidatos(nome_completo);
CREATE INDEX idx_recrutamento_candidatos_cpf ON public.recrutamento_candidatos(cpf) WHERE cpf IS NOT NULL;
CREATE INDEX idx_recrutamento_candidatos_email ON public.recrutamento_candidatos(email);
CREATE INDEX idx_recrutamento_candidatos_cargo ON public.recrutamento_candidatos(cargo_vaga_pretendida);
CREATE INDEX idx_recrutamento_candidatos_cca ON public.recrutamento_candidatos(cca_id);
CREATE INDEX idx_recrutamento_candidatos_status ON public.recrutamento_candidatos(status_candidato);
CREATE INDEX idx_recrutamento_candidatos_etapa ON public.recrutamento_candidatos(etapa_processo);
CREATE INDEX idx_recrutamento_candidatos_origem ON public.recrutamento_candidatos(origem_candidato);
CREATE INDEX idx_recrutamento_candidatos_data ON public.recrutamento_candidatos(data_cadastro);
CREATE INDEX idx_recrutamento_candidatos_ativo ON public.recrutamento_candidatos(ativo);

-- =====================================================
-- 3. TABELA: recrutamento_vagas_candidatos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.recrutamento_vagas_candidatos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vaga_id uuid NOT NULL,
  candidato_id uuid NOT NULL,
  data_aplicacao date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'em_analise',
  nota_triagem integer,
  observacoes text,
  feedback_entrevista text,
  motivo_reprovacao text,
  data_status_alteracao timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  
  CONSTRAINT uq_recrutamento_vagas_candidatos UNIQUE (vaga_id, candidato_id),
  CONSTRAINT ck_recrutamento_vagas_candidatos_status CHECK (status IN ('em_analise', 'entrevistado', 'aprovado', 'reprovado')),
  CONSTRAINT ck_recrutamento_vagas_candidatos_nota CHECK (nota_triagem >= 0 AND nota_triagem <= 10)
);

-- Índices para recrutamento_vagas_candidatos
CREATE INDEX idx_recrutamento_vagas_candidatos_vaga ON public.recrutamento_vagas_candidatos(vaga_id);
CREATE INDEX idx_recrutamento_vagas_candidatos_candidato ON public.recrutamento_vagas_candidatos(candidato_id);
CREATE INDEX idx_recrutamento_vagas_candidatos_status ON public.recrutamento_vagas_candidatos(status);
CREATE INDEX idx_recrutamento_vagas_candidatos_data ON public.recrutamento_vagas_candidatos(data_aplicacao);

-- =====================================================
-- 4. TABELA: recrutamento_etapas_sla
-- =====================================================
CREATE TABLE IF NOT EXISTS public.recrutamento_etapas_sla (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vaga_id uuid NOT NULL,
  numero_vaga text NOT NULL,
  cargo_vaga text NOT NULL,
  etapa text NOT NULL,
  descricao text NOT NULL,
  sla_prazo text NOT NULL,
  sla_dias_uteis integer NOT NULL,
  responsavel text NOT NULL,
  objetivo text NOT NULL,
  status text NOT NULL DEFAULT 'nao_iniciado',
  data_inicio date,
  data_conclusao date,
  dias_decorridos integer,
  prazo_limite date,
  atrasado boolean DEFAULT false,
  observacoes text,
  ordem integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT ck_recrutamento_etapas_sla_status CHECK (status IN ('nao_iniciado', 'em_andamento', 'concluido', 'atrasado')),
  CONSTRAINT ck_recrutamento_etapas_sla_dias_uteis CHECK (sla_dias_uteis >= 0),
  CONSTRAINT ck_recrutamento_etapas_sla_dias_decorridos CHECK (dias_decorridos IS NULL OR dias_decorridos >= 0)
);

-- Índices para recrutamento_etapas_sla
CREATE INDEX idx_recrutamento_etapas_sla_vaga ON public.recrutamento_etapas_sla(vaga_id);
CREATE INDEX idx_recrutamento_etapas_sla_etapa ON public.recrutamento_etapas_sla(etapa);
CREATE INDEX idx_recrutamento_etapas_sla_status ON public.recrutamento_etapas_sla(status);
CREATE INDEX idx_recrutamento_etapas_sla_atrasado ON public.recrutamento_etapas_sla(atrasado);
CREATE INDEX idx_recrutamento_etapas_sla_prazo ON public.recrutamento_etapas_sla(prazo_limite);
CREATE INDEX idx_recrutamento_etapas_sla_ordem ON public.recrutamento_etapas_sla(ordem);

-- =====================================================
-- 5. TABELA: recrutamento_historico_sla
-- =====================================================
CREATE TABLE IF NOT EXISTS public.recrutamento_historico_sla (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  etapa_sla_id uuid NOT NULL,
  data_alteracao timestamp with time zone NOT NULL DEFAULT now(),
  usuario text NOT NULL,
  usuario_id uuid,
  status_anterior text NOT NULL,
  status_novo text NOT NULL,
  observacao text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Índices para recrutamento_historico_sla
CREATE INDEX idx_recrutamento_historico_sla_etapa ON public.recrutamento_historico_sla(etapa_sla_id);
CREATE INDEX idx_recrutamento_historico_sla_data ON public.recrutamento_historico_sla(data_alteracao);
CREATE INDEX idx_recrutamento_historico_sla_usuario ON public.recrutamento_historico_sla(usuario_id);

-- =====================================================
-- FOREIGN KEYS
-- =====================================================

-- recrutamento_vagas
ALTER TABLE public.recrutamento_vagas ADD CONSTRAINT fk_recrutamento_vagas_cca
  FOREIGN KEY (cca_id) REFERENCES public.ccas(id) ON DELETE RESTRICT;

ALTER TABLE public.recrutamento_vagas ADD CONSTRAINT fk_recrutamento_vagas_gestor
  FOREIGN KEY (gestor_responsavel_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.recrutamento_vagas ADD CONSTRAINT fk_recrutamento_vagas_aprovador
  FOREIGN KEY (aprovador_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.recrutamento_vagas ADD CONSTRAINT fk_recrutamento_vagas_created_by
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.recrutamento_vagas ADD CONSTRAINT fk_recrutamento_vagas_updated_by
  FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- recrutamento_candidatos
ALTER TABLE public.recrutamento_candidatos ADD CONSTRAINT fk_recrutamento_candidatos_cca
  FOREIGN KEY (cca_id) REFERENCES public.ccas(id) ON DELETE SET NULL;

ALTER TABLE public.recrutamento_candidatos ADD CONSTRAINT fk_recrutamento_candidatos_responsavel
  FOREIGN KEY (responsavel_etapa_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.recrutamento_candidatos ADD CONSTRAINT fk_recrutamento_candidatos_created_by
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- recrutamento_vagas_candidatos
ALTER TABLE public.recrutamento_vagas_candidatos ADD CONSTRAINT fk_recrutamento_vagas_candidatos_vaga
  FOREIGN KEY (vaga_id) REFERENCES public.recrutamento_vagas(id) ON DELETE CASCADE;

ALTER TABLE public.recrutamento_vagas_candidatos ADD CONSTRAINT fk_recrutamento_vagas_candidatos_candidato
  FOREIGN KEY (candidato_id) REFERENCES public.recrutamento_candidatos(id) ON DELETE CASCADE;

ALTER TABLE public.recrutamento_vagas_candidatos ADD CONSTRAINT fk_recrutamento_vagas_candidatos_created_by
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- recrutamento_etapas_sla
ALTER TABLE public.recrutamento_etapas_sla ADD CONSTRAINT fk_recrutamento_etapas_sla_vaga
  FOREIGN KEY (vaga_id) REFERENCES public.recrutamento_vagas(id) ON DELETE CASCADE;

-- recrutamento_historico_sla
ALTER TABLE public.recrutamento_historico_sla ADD CONSTRAINT fk_recrutamento_historico_sla_etapa
  FOREIGN KEY (etapa_sla_id) REFERENCES public.recrutamento_etapas_sla(id) ON DELETE CASCADE;

ALTER TABLE public.recrutamento_historico_sla ADD CONSTRAINT fk_recrutamento_historico_sla_usuario
  FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: sync_vaga_cca_data
CREATE OR REPLACE FUNCTION public.sync_vaga_cca_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.cca_id IS NOT NULL THEN
    SELECT codigo, nome INTO NEW.cca_codigo, NEW.cca_nome
    FROM ccas
    WHERE id = NEW.cca_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: sync_candidato_cca_data
CREATE OR REPLACE FUNCTION public.sync_candidato_cca_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.cca_id IS NOT NULL THEN
    SELECT codigo, nome INTO NEW.cca_codigo, NEW.cca_nome
    FROM ccas
    WHERE id = NEW.cca_id;
  ELSE
    NEW.cca_codigo := NULL;
    NEW.cca_nome := NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: criar_etapas_sla_automatico
CREATE OR REPLACE FUNCTION public.criar_etapas_sla_automatico()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  etapa_config RECORD;
  etapas_config jsonb := '[
    {"tipo": "solicitacao_vaga", "nome": "Solicitação da vaga", "descricao": "Recebimento e registro da solicitação de vaga", "sla_prazo": "0 dia", "sla_dias_uteis": 0, "responsavel": "Gestor solicitante / RH", "objetivo": "Início do processo", "ordem": 1},
    {"tipo": "aprovacao_divulgacao", "nome": "Aprovação e Divulgação da vaga", "descricao": "Validação da solicitação e publicação da vaga", "sla_prazo": "Até 2 dias úteis", "sla_dias_uteis": 2, "responsavel": "RH", "objetivo": "Evitar atraso no início do processo", "ordem": 2},
    {"tipo": "triagem_curriculos", "nome": "Triagem de currículos", "descricao": "Análise e seleção de perfis aderentes à vaga", "sla_prazo": "Até 5 dias úteis", "sla_dias_uteis": 5, "responsavel": "RH", "objetivo": "Garantir assertividade no envio ao gestor", "ordem": 3},
    {"tipo": "envio_candidatos", "nome": "Envio de candidatos ao gestor", "descricao": "Encaminhamento dos perfis selecionados", "sla_prazo": "Até 7 dias úteis", "sla_dias_uteis": 7, "responsavel": "RH", "objetivo": "Agilizar avaliação do gestor", "ordem": 4},
    {"tipo": "devolutiva_gestor", "nome": "Devolutiva do gestor", "descricao": "Retorno com candidatos aprovados para próxima etapa", "sla_prazo": "Até 3 dias úteis", "sla_dias_uteis": 3, "responsavel": "Gestor da área", "objetivo": "Evitar gargalos na decisão", "ordem": 5},
    {"tipo": "agendamento_entrevistas", "nome": "Agendamento de entrevistas", "descricao": "Contato com candidatos e definição de horários", "sla_prazo": "Até 3 dias úteis", "sla_dias_uteis": 3, "responsavel": "RH", "objetivo": "Organização do cronograma de entrevistas", "ordem": 6},
    {"tipo": "aplicacao_testes", "nome": "Aplicação de testes e perfil comportamental", "descricao": "Aplicação de testes técnicos ou de perfil", "sla_prazo": "Dentro do ciclo", "sla_dias_uteis": 3, "responsavel": "RH", "objetivo": "Avaliar aderência técnica e comportamental", "ordem": 7},
    {"tipo": "entrevistas_finais", "nome": "Entrevistas finais (com gestor)", "descricao": "Entrevistas finais até decisão final de contratação", "sla_prazo": "Até 15 dias úteis", "sla_dias_uteis": 15, "responsavel": "RH + Gestor", "objetivo": "Concluir processo dentro do prazo total", "ordem": 8}
  ]'::jsonb;
BEGIN
  IF NEW.status_aprovacao = 'aprovado' AND (OLD IS NULL OR OLD.status_aprovacao != 'aprovado') THEN
    FOR etapa_config IN SELECT * FROM jsonb_to_recordset(etapas_config) AS x(
      tipo text, nome text, descricao text, sla_prazo text, 
      sla_dias_uteis int, responsavel text, objetivo text, ordem int
    )
    LOOP
      INSERT INTO recrutamento_etapas_sla (
        vaga_id, numero_vaga, cargo_vaga, etapa, descricao,
        sla_prazo, sla_dias_uteis, responsavel, objetivo, ordem,
        status, data_inicio
      ) VALUES (
        NEW.id, NEW.numero_vaga, NEW.cargo, etapa_config.tipo, etapa_config.descricao,
        etapa_config.sla_prazo, etapa_config.sla_dias_uteis, etapa_config.responsavel, 
        etapa_config.objetivo, etapa_config.ordem,
        CASE WHEN etapa_config.ordem = 1 THEN 'concluido' ELSE 'nao_iniciado' END,
        CASE WHEN etapa_config.ordem = 1 THEN NEW.created_at::date ELSE NULL END
      );
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: atualizar_status_etapa_sla
CREATE OR REPLACE FUNCTION public.atualizar_status_etapa_sla()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Calcular dias decorridos
  IF NEW.data_inicio IS NOT NULL AND NEW.status IN ('em_andamento', 'concluido') THEN
    NEW.dias_decorridos := (COALESCE(NEW.data_conclusao, CURRENT_DATE) - NEW.data_inicio)::integer;
  END IF;
  
  -- Calcular prazo limite
  IF NEW.data_inicio IS NOT NULL AND NEW.sla_dias_uteis > 0 THEN
    NEW.prazo_limite := NEW.data_inicio + (NEW.sla_dias_uteis || ' days')::interval;
  END IF;
  
  -- Verificar se está atrasado
  IF NEW.status = 'em_andamento' AND NEW.prazo_limite IS NOT NULL THEN
    NEW.atrasado := CURRENT_DATE > NEW.prazo_limite;
    IF NEW.atrasado THEN
      NEW.status := 'atrasado';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function: registrar_historico_sla
CREATE OR REPLACE FUNCTION public.registrar_historico_sla()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO recrutamento_historico_sla (
      etapa_sla_id, usuario, usuario_id, status_anterior, status_novo, observacao
    ) VALUES (
      NEW.id,
      COALESCE(current_setting('app.current_user_name', true), 'Sistema'),
      auth.uid(),
      OLD.status,
      NEW.status,
      NEW.observacoes
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Function: get_vagas_atrasadas
CREATE OR REPLACE FUNCTION public.get_vagas_atrasadas()
RETURNS TABLE (
  vaga_id uuid,
  numero_vaga text,
  cargo text,
  etapa text,
  dias_atraso integer,
  responsavel text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.vaga_id,
    e.numero_vaga,
    e.cargo_vaga,
    e.etapa,
    (CURRENT_DATE - e.prazo_limite)::integer as dias_atraso,
    e.responsavel
  FROM recrutamento_etapas_sla e
  WHERE e.atrasado = true
  AND e.status IN ('em_andamento', 'atrasado')
  ORDER BY dias_atraso DESC;
END;
$$;

-- Function: get_candidatos_por_etapa
CREATE OR REPLACE FUNCTION public.get_candidatos_por_etapa(vaga_id_param uuid)
RETURNS TABLE (
  etapa text,
  quantidade bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vc.status,
    COUNT(*)
  FROM recrutamento_vagas_candidatos vc
  WHERE vc.vaga_id = vaga_id_param
  GROUP BY vc.status
  ORDER BY 
    CASE vc.status
      WHEN 'em_analise' THEN 1
      WHEN 'entrevistado' THEN 2
      WHEN 'aprovado' THEN 3
      WHEN 'reprovado' THEN 4
    END;
END;
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Triggers para recrutamento_vagas
CREATE TRIGGER set_created_by_recrutamento_vagas
  BEFORE INSERT ON public.recrutamento_vagas
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER update_updated_at_recrutamento_vagas
  BEFORE UPDATE ON public.recrutamento_vagas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER sync_vaga_cca_data_trigger
  BEFORE INSERT OR UPDATE ON public.recrutamento_vagas
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_vaga_cca_data();

CREATE TRIGGER criar_etapas_sla_automatico_trigger
  AFTER INSERT OR UPDATE ON public.recrutamento_vagas
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_etapas_sla_automatico();

-- Triggers para recrutamento_candidatos
CREATE TRIGGER set_created_by_recrutamento_candidatos
  BEFORE INSERT ON public.recrutamento_candidatos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER update_updated_at_recrutamento_candidatos
  BEFORE UPDATE ON public.recrutamento_candidatos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER sync_candidato_cca_data_trigger
  BEFORE INSERT OR UPDATE ON public.recrutamento_candidatos
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_candidato_cca_data();

-- Triggers para recrutamento_vagas_candidatos
CREATE TRIGGER set_created_by_recrutamento_vagas_candidatos
  BEFORE INSERT ON public.recrutamento_vagas_candidatos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER update_updated_at_recrutamento_vagas_candidatos
  BEFORE UPDATE ON public.recrutamento_vagas_candidatos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Triggers para recrutamento_etapas_sla
CREATE TRIGGER update_updated_at_recrutamento_etapas_sla
  BEFORE UPDATE ON public.recrutamento_etapas_sla
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER atualizar_status_etapa_sla_trigger
  BEFORE INSERT OR UPDATE ON public.recrutamento_etapas_sla
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_status_etapa_sla();

CREATE TRIGGER registrar_historico_sla_trigger
  AFTER UPDATE ON public.recrutamento_etapas_sla
  FOR EACH ROW
  EXECUTE FUNCTION public.registrar_historico_sla();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.recrutamento_vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recrutamento_candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recrutamento_vagas_candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recrutamento_etapas_sla ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recrutamento_historico_sla ENABLE ROW LEVEL SECURITY;

-- Políticas para recrutamento_vagas
CREATE POLICY "Usuários podem visualizar vagas do seu CCA"
  ON public.recrutamento_vagas
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      created_by = auth.uid()
      OR 'recrutamento_visualizar'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
    AND (
      cca_id = ANY(get_user_allowed_ccas(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  );

CREATE POLICY "Usuários podem criar vagas no seu CCA"
  ON public.recrutamento_vagas
  FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL)
    AND (
      'recrutamento_cadastro'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
    AND (
      cca_id = ANY(get_user_allowed_ccas(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  );

CREATE POLICY "Usuários podem editar vagas do seu CCA"
  ON public.recrutamento_vagas
  FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      'recrutamento_edicao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
    AND (
      cca_id = ANY(get_user_allowed_ccas(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  );

CREATE POLICY "Apenas admins podem deletar vagas"
  ON public.recrutamento_vagas
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

-- Políticas para recrutamento_candidatos
CREATE POLICY "Usuários podem visualizar candidatos"
  ON public.recrutamento_candidatos
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      created_by = auth.uid()
      OR 'recrutamento_visualizar'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
    AND (
      cca_id = ANY(get_user_allowed_ccas(auth.uid()))
      OR cca_id IS NULL
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  );

CREATE POLICY "Usuários podem criar candidatos"
  ON public.recrutamento_candidatos
  FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL)
    AND (
      'recrutamento_cadastro'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
    AND (
      cca_id = ANY(get_user_allowed_ccas(auth.uid()))
      OR cca_id IS NULL
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  );

CREATE POLICY "Usuários podem editar candidatos"
  ON public.recrutamento_candidatos
  FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      'recrutamento_edicao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
    AND (
      cca_id = ANY(get_user_allowed_ccas(auth.uid()))
      OR cca_id IS NULL
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  );

CREATE POLICY "Apenas admins podem deletar candidatos"
  ON public.recrutamento_candidatos
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

-- Políticas para recrutamento_vagas_candidatos
CREATE POLICY "Usuários podem visualizar aplicações"
  ON public.recrutamento_vagas_candidatos
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      created_by = auth.uid()
      OR 'recrutamento_visualizar'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Usuários podem criar aplicações"
  ON public.recrutamento_vagas_candidatos
  FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL)
    AND (
      'recrutamento_cadastro'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Usuários podem editar aplicações"
  ON public.recrutamento_vagas_candidatos
  FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      'recrutamento_edicao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Apenas admins podem deletar aplicações"
  ON public.recrutamento_vagas_candidatos
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

-- Políticas para recrutamento_etapas_sla
CREATE POLICY "Usuários podem visualizar etapas SLA"
  ON public.recrutamento_etapas_sla
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      'recrutamento_visualizar'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Sistema pode criar etapas SLA"
  ON public.recrutamento_etapas_sla
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários podem editar etapas SLA"
  ON public.recrutamento_etapas_sla
  FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      'recrutamento_edicao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Apenas admins podem deletar etapas SLA"
  ON public.recrutamento_etapas_sla
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL)
    AND has_role(auth.uid(), 'admin_sistema'::app_role)
  );

-- Políticas para recrutamento_historico_sla
CREATE POLICY "Usuários podem visualizar histórico SLA"
  ON public.recrutamento_historico_sla
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL)
    AND (
      'recrutamento_visualizar'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Sistema pode criar histórico SLA"
  ON public.recrutamento_historico_sla
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- STORAGE BUCKET
-- =====================================================

-- Criar bucket para documentos de recrutamento
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recrutamento-documentos',
  'recrutamento-documentos',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
CREATE POLICY "Usuários autenticados podem visualizar documentos"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'recrutamento-documentos'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Usuários podem fazer upload de documentos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'recrutamento-documentos'
    AND auth.uid() IS NOT NULL
    AND (
      'recrutamento_cadastro'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Usuários podem atualizar seus documentos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'recrutamento-documentos'
    AND auth.uid() IS NOT NULL
    AND (
      'recrutamento_edicao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Apenas admins podem deletar documentos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'recrutamento-documentos'
    AND auth.uid() IS NOT NULL
    AND has_role(auth.uid(), 'admin_sistema'::app_role)
  );

-- =====================================================
-- VIEWS MATERIALIZADAS
-- =====================================================

-- View: Resumo de Vagas
CREATE MATERIALIZED VIEW IF NOT EXISTS public.view_vagas_resumo AS
SELECT 
  v.id,
  v.numero_vaga,
  v.cargo,
  v.cca_codigo,
  v.cca_nome,
  v.status,
  v.status_aprovacao,
  v.prioridade,
  v.prazo_mobilizacao,
  COUNT(DISTINCT vc.candidato_id) as total_candidatos,
  COUNT(DISTINCT CASE WHEN vc.status = 'aprovado' THEN vc.candidato_id END) as candidatos_aprovados,
  COUNT(DISTINCT CASE WHEN e.atrasado THEN e.id END) as etapas_atrasadas,
  v.created_at,
  v.updated_at
FROM recrutamento_vagas v
LEFT JOIN recrutamento_vagas_candidatos vc ON vc.vaga_id = v.id
LEFT JOIN recrutamento_etapas_sla e ON e.vaga_id = v.id
GROUP BY v.id, v.numero_vaga, v.cargo, v.cca_codigo, v.cca_nome, 
         v.status, v.status_aprovacao, v.prioridade, v.prazo_mobilizacao,
         v.created_at, v.updated_at;

CREATE UNIQUE INDEX idx_view_vagas_resumo_id ON public.view_vagas_resumo(id);

-- View: Estatísticas de Candidatos
CREATE MATERIALIZED VIEW IF NOT EXISTS public.view_candidatos_estatisticas AS
SELECT 
  c.id,
  c.nome_completo,
  c.cargo_vaga_pretendida,
  c.status_candidato,
  c.etapa_processo,
  c.origem_candidato,
  c.cca_codigo,
  COUNT(DISTINCT vc.vaga_id) as total_aplicacoes,
  COUNT(DISTINCT CASE WHEN vc.status = 'aprovado' THEN vc.vaga_id END) as total_aprovacoes,
  COUNT(DISTINCT CASE WHEN vc.status = 'reprovado' THEN vc.vaga_id END) as total_reprovacoes,
  c.data_cadastro,
  c.data_ultima_atualizacao
FROM recrutamento_candidatos c
LEFT JOIN recrutamento_vagas_candidatos vc ON vc.candidato_id = c.id
GROUP BY c.id, c.nome_completo, c.cargo_vaga_pretendida, c.status_candidato,
         c.etapa_processo, c.origem_candidato, c.cca_codigo,
         c.data_cadastro, c.data_ultima_atualizacao;

CREATE UNIQUE INDEX idx_view_candidatos_estatisticas_id ON public.view_candidatos_estatisticas(id);