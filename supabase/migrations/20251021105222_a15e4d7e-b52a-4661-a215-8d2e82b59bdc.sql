-- =====================================================
-- MÓDULO DE VEÍCULOS - ESTRUTURA COMPLETA
-- =====================================================

-- =====================================================
-- 1. TABELA: veiculos_locadoras
-- =====================================================
CREATE TABLE IF NOT EXISTS public.veiculos_locadoras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cnpj VARCHAR(18),
  telefone VARCHAR(15),
  email TEXT,
  endereco TEXT,
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_veiculos_locadoras_nome ON public.veiculos_locadoras(nome);
CREATE INDEX idx_veiculos_locadoras_ativo ON public.veiculos_locadoras(ativo);

-- =====================================================
-- 2. TABELA: veiculos_condutores
-- =====================================================
CREATE TABLE IF NOT EXISTS public.veiculos_condutores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_condutor TEXT NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  categoria_cnh VARCHAR(3) NOT NULL,
  validade_cnh DATE NOT NULL,
  status_cnh TEXT NOT NULL DEFAULT 'ativa',
  pontuacao_atual INTEGER NOT NULL DEFAULT 0,
  termo_responsabilidade_assinado BOOLEAN NOT NULL DEFAULT false,
  termo_anexado_url TEXT,
  termo_anexado_nome TEXT,
  observacao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT check_pontuacao_positiva CHECK (pontuacao_atual >= 0),
  CONSTRAINT check_status_cnh CHECK (status_cnh IN ('ativa', 'vencida', 'suspensa', 'cassada')),
  CONSTRAINT check_categoria_cnh CHECK (categoria_cnh IN ('A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'))
);

CREATE INDEX idx_veiculos_condutores_cpf ON public.veiculos_condutores(cpf);
CREATE INDEX idx_veiculos_condutores_status_cnh ON public.veiculos_condutores(status_cnh);
CREATE INDEX idx_veiculos_condutores_validade_cnh ON public.veiculos_condutores(validade_cnh);
CREATE INDEX idx_veiculos_condutores_ativo ON public.veiculos_condutores(ativo);

-- =====================================================
-- 3. TABELA: veiculos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.veiculos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'ativo',
  locadora_id UUID REFERENCES public.veiculos_locadoras(id) ON DELETE SET NULL,
  locadora_nome TEXT,
  tipo_locacao TEXT NOT NULL,
  placa VARCHAR(8) NOT NULL UNIQUE,
  modelo TEXT NOT NULL,
  franquia_km TEXT,
  condutor_principal_id UUID REFERENCES public.veiculos_condutores(id) ON DELETE RESTRICT,
  condutor_principal_nome TEXT NOT NULL,
  data_retirada DATE NOT NULL,
  data_devolucao DATE NOT NULL,
  motivo_devolucao TEXT,
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT check_status_veiculo CHECK (status IN ('ativo', 'encerrado')),
  CONSTRAINT check_tipo_locacao CHECK (tipo_locacao IN ('mensal', 'esporadico')),
  CONSTRAINT check_datas_veiculo CHECK (data_devolucao >= data_retirada)
);

CREATE INDEX idx_veiculos_placa ON public.veiculos(placa);
CREATE INDEX idx_veiculos_status ON public.veiculos(status);
CREATE INDEX idx_veiculos_condutor_principal ON public.veiculos(condutor_principal_id);
CREATE INDEX idx_veiculos_locadora ON public.veiculos(locadora_id);
CREATE INDEX idx_veiculos_ativo ON public.veiculos(ativo);

-- =====================================================
-- 4. TABELA: veiculos_multas
-- =====================================================
CREATE TABLE IF NOT EXISTS public.veiculos_multas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_auto_infracao TEXT NOT NULL,
  data_multa DATE NOT NULL,
  horario TIME NOT NULL,
  ocorrencia TEXT NOT NULL,
  pontos INTEGER NOT NULL,
  condutor_infrator_id UUID REFERENCES public.veiculos_condutores(id) ON DELETE RESTRICT,
  condutor_infrator_nome TEXT NOT NULL,
  placa VARCHAR(8) NOT NULL,
  veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE SET NULL,
  veiculo_modelo TEXT,
  locadora_nome TEXT,
  data_notificacao DATE,
  responsavel TEXT,
  valor DECIMAL(10,2),
  local_completo TEXT,
  email_condutor TEXT,
  numero_fatura TEXT,
  titulo_sienge TEXT,
  indicado_orgao TEXT NOT NULL DEFAULT 'Pendente',
  status_multa TEXT NOT NULL DEFAULT 'Registrada',
  documento_notificacao_url TEXT,
  documento_notificacao_nome TEXT,
  formulario_preenchido_url TEXT,
  formulario_preenchido_nome TEXT,
  comprovante_indicacao_url TEXT,
  comprovante_indicacao_nome TEXT,
  email_condutor_enviado_em TIMESTAMP WITH TIME ZONE,
  email_rh_financeiro_enviado_em TIMESTAMP WITH TIME ZONE,
  desconto_confirmado BOOLEAN NOT NULL DEFAULT false,
  observacoes_gerais TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT check_pontos_positivos CHECK (pontos >= 0),
  CONSTRAINT check_valor_positivo CHECK (valor IS NULL OR valor >= 0),
  CONSTRAINT check_indicado_orgao CHECK (indicado_orgao IN ('Sim', 'Não', 'Pendente')),
  CONSTRAINT check_status_multa CHECK (status_multa IN ('Registrada', 'Condutor Notificado', 'Formulário Retornado', 'Indicada ao Órgão', 'Lançada no Sienge', 'RH/Financeiro Notificado', 'Desconto Confirmado', 'Processo Concluído'))
);

CREATE INDEX idx_veiculos_multas_placa ON public.veiculos_multas(placa);
CREATE INDEX idx_veiculos_multas_condutor ON public.veiculos_multas(condutor_infrator_id);
CREATE INDEX idx_veiculos_multas_data ON public.veiculos_multas(data_multa);
CREATE INDEX idx_veiculos_multas_status ON public.veiculos_multas(status_multa);
CREATE INDEX idx_veiculos_multas_indicado ON public.veiculos_multas(indicado_orgao);
CREATE INDEX idx_veiculos_multas_veiculo ON public.veiculos_multas(veiculo_id);

-- =====================================================
-- 5. TABELA: veiculos_cartoes_abastecimento
-- =====================================================
CREATE TABLE IF NOT EXISTS public.veiculos_cartoes_abastecimento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'ativo',
  condutor_id UUID REFERENCES public.veiculos_condutores(id) ON DELETE RESTRICT,
  condutor_nome TEXT NOT NULL,
  placa VARCHAR(8) NOT NULL,
  veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE SET NULL,
  veiculo_modelo TEXT,
  numero_cartao TEXT NOT NULL,
  numero_cartao_hash TEXT NOT NULL UNIQUE,
  data_validade DATE NOT NULL,
  tipo_cartao TEXT NOT NULL,
  limite_credito DECIMAL(10,2),
  bandeira TEXT,
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT check_status_cartao CHECK (status IN ('ativo', 'bloqueado', 'cancelado')),
  CONSTRAINT check_tipo_cartao CHECK (tipo_cartao IN ('combustivel', 'pedagio', 'multiplo'))
);

CREATE INDEX idx_veiculos_cartoes_condutor ON public.veiculos_cartoes_abastecimento(condutor_id);
CREATE INDEX idx_veiculos_cartoes_placa ON public.veiculos_cartoes_abastecimento(placa);
CREATE INDEX idx_veiculos_cartoes_status ON public.veiculos_cartoes_abastecimento(status);
CREATE INDEX idx_veiculos_cartoes_hash ON public.veiculos_cartoes_abastecimento(numero_cartao_hash);
CREATE INDEX idx_veiculos_cartoes_veiculo ON public.veiculos_cartoes_abastecimento(veiculo_id);

-- =====================================================
-- 6. TABELA: veiculos_pedagogios_estacionamentos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.veiculos_pedagogios_estacionamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  placa VARCHAR(8) NOT NULL,
  veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE SET NULL,
  condutor_id UUID REFERENCES public.veiculos_condutores(id) ON DELETE SET NULL,
  condutor_nome TEXT NOT NULL,
  data_utilizacao DATE NOT NULL,
  horario TIME NOT NULL,
  local TEXT NOT NULL,
  valor DECIMAL(10,2),
  tipo_servico TEXT NOT NULL,
  cca TEXT,
  finalidade TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT check_tipo_servico CHECK (tipo_servico IN ('pedagio', 'estacionamento', 'lavagem', 'posto', 'outros')),
  CONSTRAINT check_finalidade CHECK (finalidade IS NULL OR finalidade IN ('trabalho', 'pessoal', 'emergencia', 'manutencao', 'outros'))
);

CREATE INDEX idx_veiculos_pedagogios_placa ON public.veiculos_pedagogios_estacionamentos(placa);
CREATE INDEX idx_veiculos_pedagogios_condutor ON public.veiculos_pedagogios_estacionamentos(condutor_id);
CREATE INDEX idx_veiculos_pedagogios_data ON public.veiculos_pedagogios_estacionamentos(data_utilizacao);
CREATE INDEX idx_veiculos_pedagogios_tipo ON public.veiculos_pedagogios_estacionamentos(tipo_servico);
CREATE INDEX idx_veiculos_pedagogios_veiculo ON public.veiculos_pedagogios_estacionamentos(veiculo_id);

-- =====================================================
-- 7. TABELA: veiculos_checklists
-- =====================================================
CREATE TABLE IF NOT EXISTS public.veiculos_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_checklist DATE NOT NULL,
  placa VARCHAR(8) NOT NULL,
  veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE SET NULL,
  condutor_id UUID REFERENCES public.veiculos_condutores(id) ON DELETE RESTRICT,
  condutor_nome TEXT NOT NULL,
  tipo_operacao TEXT NOT NULL,
  marca_modelo TEXT NOT NULL,
  nivel_combustivel TEXT,
  hodometro INTEGER,
  status TEXT NOT NULL DEFAULT 'Pendente',
  data_limite DATE,
  observacoes TEXT,
  observacoes_detalhadas TEXT,
  tentativas_cobranca INTEGER NOT NULL DEFAULT 0,
  fotos_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT check_tipo_operacao CHECK (tipo_operacao IN ('Retirada', 'Devolução')),
  CONSTRAINT check_status_checklist CHECK (status IN ('Concluído', 'Pendente')),
  CONSTRAINT check_nivel_combustivel CHECK (nivel_combustivel IS NULL OR nivel_combustivel IN ('V', '3/4', '1/2', '1/4', 'F'))
);

CREATE INDEX idx_veiculos_checklists_placa ON public.veiculos_checklists(placa);
CREATE INDEX idx_veiculos_checklists_condutor ON public.veiculos_checklists(condutor_id);
CREATE INDEX idx_veiculos_checklists_data ON public.veiculos_checklists(data_checklist);
CREATE INDEX idx_veiculos_checklists_status ON public.veiculos_checklists(status);
CREATE INDEX idx_veiculos_checklists_tipo ON public.veiculos_checklists(tipo_operacao);
CREATE INDEX idx_veiculos_checklists_veiculo ON public.veiculos_checklists(veiculo_id);

-- =====================================================
-- 8. TABELA: veiculos_abastecimentos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.veiculos_abastecimentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  motorista TEXT NOT NULL,
  condutor_id UUID REFERENCES public.veiculos_condutores(id) ON DELETE SET NULL,
  centro_custo TEXT,
  placa VARCHAR(8) NOT NULL,
  veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE SET NULL,
  modelo_veiculo TEXT,
  tipo_cartao TEXT,
  numero_cartao TEXT,
  data_hora_transacao TIMESTAMP WITH TIME ZONE NOT NULL,
  uf_estabelecimento VARCHAR(2),
  cidade_estabelecimento TEXT,
  nome_estabelecimento TEXT,
  tipo_mercadoria TEXT,
  mercadoria TEXT,
  quantidade_litros DECIMAL(10,3),
  valor DECIMAL(10,2) NOT NULL,
  data_upload TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  usuario_responsavel TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_veiculos_abastecimentos_placa ON public.veiculos_abastecimentos(placa);
CREATE INDEX idx_veiculos_abastecimentos_condutor ON public.veiculos_abastecimentos(condutor_id);
CREATE INDEX idx_veiculos_abastecimentos_data ON public.veiculos_abastecimentos(data_hora_transacao);
CREATE INDEX idx_veiculos_abastecimentos_tipo ON public.veiculos_abastecimentos(tipo_mercadoria);
CREATE INDEX idx_veiculos_abastecimentos_veiculo ON public.veiculos_abastecimentos(veiculo_id);

-- =====================================================
-- TRIGGERS - Aplicar update_updated_at em todas as tabelas
-- =====================================================
CREATE TRIGGER update_veiculos_locadoras_updated_at
  BEFORE UPDATE ON public.veiculos_locadoras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_veiculos_condutores_updated_at
  BEFORE UPDATE ON public.veiculos_condutores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_veiculos_updated_at
  BEFORE UPDATE ON public.veiculos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_veiculos_multas_updated_at
  BEFORE UPDATE ON public.veiculos_multas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_veiculos_cartoes_updated_at
  BEFORE UPDATE ON public.veiculos_cartoes_abastecimento
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_veiculos_pedagogios_updated_at
  BEFORE UPDATE ON public.veiculos_pedagogios_estacionamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_veiculos_checklists_updated_at
  BEFORE UPDATE ON public.veiculos_checklists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- TRIGGERS - Aplicar set_created_by nas tabelas com created_by
-- =====================================================
CREATE TRIGGER set_veiculos_condutores_created_by
  BEFORE INSERT ON public.veiculos_condutores
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_veiculos_created_by
  BEFORE INSERT ON public.veiculos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_veiculos_multas_created_by
  BEFORE INSERT ON public.veiculos_multas
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_veiculos_cartoes_created_by
  BEFORE INSERT ON public.veiculos_cartoes_abastecimento
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_veiculos_pedagogios_created_by
  BEFORE INSERT ON public.veiculos_pedagogios_estacionamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_veiculos_checklists_created_by
  BEFORE INSERT ON public.veiculos_checklists
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_veiculos_abastecimentos_created_by
  BEFORE INSERT ON public.veiculos_abastecimentos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

-- =====================================================
-- FUNCTION: Atualizar pontuação do condutor
-- =====================================================
CREATE OR REPLACE FUNCTION public.atualizar_pontuacao_condutor()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.veiculos_condutores
  SET pontuacao_atual = (
    SELECT COALESCE(SUM(pontos), 0)
    FROM public.veiculos_multas
    WHERE condutor_infrator_id = NEW.condutor_infrator_id
    AND status_multa NOT IN ('Processo Concluído')
  )
  WHERE id = NEW.condutor_infrator_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_atualizar_pontuacao_condutor
  AFTER INSERT OR UPDATE ON public.veiculos_multas
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_pontuacao_condutor();

-- =====================================================
-- FUNCTION: Validar status da CNH
-- =====================================================
CREATE OR REPLACE FUNCTION public.validar_status_cnh()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.validade_cnh < CURRENT_DATE THEN
    NEW.status_cnh := 'vencida';
  ELSIF NEW.validade_cnh <= CURRENT_DATE + INTERVAL '30 days' AND NEW.status_cnh = 'ativa' THEN
    -- Mantém como ativa mas sinaliza que está vencendo
    NEW.status_cnh := 'ativa';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_status_cnh
  BEFORE INSERT OR UPDATE ON public.veiculos_condutores
  FOR EACH ROW
  EXECUTE FUNCTION public.validar_status_cnh();

-- =====================================================
-- FUNCTION: Obter condutores com CNH vencendo
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_condutores_cnh_vencendo(dias integer DEFAULT 30)
RETURNS TABLE (
  id uuid,
  nome_condutor text,
  validade_cnh date,
  dias_restantes integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vc.id,
    vc.nome_condutor,
    vc.validade_cnh,
    (vc.validade_cnh - CURRENT_DATE)::integer as dias_restantes
  FROM public.veiculos_condutores vc
  WHERE vc.ativo = true
  AND vc.status_cnh = 'ativa'
  AND vc.validade_cnh BETWEEN CURRENT_DATE AND CURRENT_DATE + dias
  ORDER BY vc.validade_cnh;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- FUNCTION: Obter multas pendentes de notificação
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_multas_pendentes_notificacao()
RETURNS TABLE (
  id uuid,
  numero_auto_infracao text,
  condutor_infrator_nome text,
  placa varchar(8),
  status_multa text,
  dias_desde_notificacao integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vm.id,
    vm.numero_auto_infracao,
    vm.condutor_infrator_nome,
    vm.placa,
    vm.status_multa,
    (CURRENT_DATE - vm.data_notificacao)::integer as dias_desde_notificacao
  FROM public.veiculos_multas vm
  WHERE vm.status_multa IN ('Registrada', 'Condutor Notificado')
  AND vm.data_notificacao IS NOT NULL
  AND vm.data_notificacao < CURRENT_DATE - INTERVAL '7 days'
  ORDER BY vm.data_notificacao;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- STORAGE BUCKET: veiculos-documentos
-- =====================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('veiculos-documentos', 'veiculos-documentos', false)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- RLS POLICIES - veiculos_locadoras
-- =====================================================
ALTER TABLE public.veiculos_locadoras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "veiculos_locadoras_select_policy"
ON public.veiculos_locadoras FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_visualizar'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_locadoras_insert_policy"
ON public.veiculos_locadoras FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_cadastro'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_locadoras_update_policy"
ON public.veiculos_locadoras FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_edicao'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_locadoras_delete_policy"
ON public.veiculos_locadoras FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

-- =====================================================
-- RLS POLICIES - veiculos_condutores
-- =====================================================
ALTER TABLE public.veiculos_condutores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "veiculos_condutores_select_policy"
ON public.veiculos_condutores FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    created_by = auth.uid()
    OR 'veiculos_visualizar'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_condutores_insert_policy"
ON public.veiculos_condutores FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_cadastro'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_condutores_update_policy"
ON public.veiculos_condutores FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_edicao'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_condutores_delete_policy"
ON public.veiculos_condutores FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

-- =====================================================
-- RLS POLICIES - veiculos
-- =====================================================
ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "veiculos_select_policy"
ON public.veiculos FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    created_by = auth.uid()
    OR 'veiculos_visualizar'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_insert_policy"
ON public.veiculos FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_cadastro'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_update_policy"
ON public.veiculos FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_edicao'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_delete_policy"
ON public.veiculos FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

-- =====================================================
-- RLS POLICIES - veiculos_multas
-- =====================================================
ALTER TABLE public.veiculos_multas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "veiculos_multas_select_policy"
ON public.veiculos_multas FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    created_by = auth.uid()
    OR 'veiculos_visualizar'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_multas_insert_policy"
ON public.veiculos_multas FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_cadastro'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_multas_update_policy"
ON public.veiculos_multas FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_edicao'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_multas_delete_policy"
ON public.veiculos_multas FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

-- =====================================================
-- RLS POLICIES - veiculos_cartoes_abastecimento
-- =====================================================
ALTER TABLE public.veiculos_cartoes_abastecimento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "veiculos_cartoes_select_policy"
ON public.veiculos_cartoes_abastecimento FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    created_by = auth.uid()
    OR 'veiculos_visualizar'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_cartoes_insert_policy"
ON public.veiculos_cartoes_abastecimento FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_cadastro'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_cartoes_update_policy"
ON public.veiculos_cartoes_abastecimento FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_edicao'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_cartoes_delete_policy"
ON public.veiculos_cartoes_abastecimento FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

-- =====================================================
-- RLS POLICIES - veiculos_pedagogios_estacionamentos
-- =====================================================
ALTER TABLE public.veiculos_pedagogios_estacionamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "veiculos_pedagogios_select_policy"
ON public.veiculos_pedagogios_estacionamentos FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    created_by = auth.uid()
    OR 'veiculos_visualizar'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_pedagogios_insert_policy"
ON public.veiculos_pedagogios_estacionamentos FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_cadastro'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_pedagogios_update_policy"
ON public.veiculos_pedagogios_estacionamentos FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_edicao'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_pedagogios_delete_policy"
ON public.veiculos_pedagogios_estacionamentos FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

-- =====================================================
-- RLS POLICIES - veiculos_checklists
-- =====================================================
ALTER TABLE public.veiculos_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "veiculos_checklists_select_policy"
ON public.veiculos_checklists FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    created_by = auth.uid()
    OR 'veiculos_visualizar'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_checklists_insert_policy"
ON public.veiculos_checklists FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_cadastro'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_checklists_update_policy"
ON public.veiculos_checklists FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_edicao'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_checklists_delete_policy"
ON public.veiculos_checklists FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

-- =====================================================
-- RLS POLICIES - veiculos_abastecimentos
-- =====================================================
ALTER TABLE public.veiculos_abastecimentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "veiculos_abastecimentos_select_policy"
ON public.veiculos_abastecimentos FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    created_by = auth.uid()
    OR 'veiculos_visualizar'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_abastecimentos_insert_policy"
ON public.veiculos_abastecimentos FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_cadastro'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_abastecimentos_update_policy"
ON public.veiculos_abastecimentos FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND (
    'veiculos_edicao'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_abastecimentos_delete_policy"
ON public.veiculos_abastecimentos FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

-- =====================================================
-- STORAGE POLICIES - veiculos-documentos
-- =====================================================
CREATE POLICY "veiculos_documentos_select_policy"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'veiculos-documentos'
  AND auth.uid() IS NOT NULL
  AND (
    'veiculos_visualizar'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_documentos_insert_policy"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'veiculos-documentos'
  AND auth.uid() IS NOT NULL
  AND (
    'veiculos_cadastro'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_documentos_update_policy"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'veiculos-documentos'
  AND auth.uid() IS NOT NULL
  AND (
    'veiculos_edicao'::text = ANY(public.get_user_permissions(auth.uid()))
    OR public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

CREATE POLICY "veiculos_documentos_delete_policy"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'veiculos-documentos'
  AND auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'admin_sistema'::public.app_role)
    OR '*'::text = ANY(public.get_user_permissions(auth.uid()))
  )
);

-- =====================================================
-- SEED DATA - Locadoras comuns
-- =====================================================
INSERT INTO public.veiculos_locadoras (nome, cnpj, ativo) VALUES
('Localiza', '59.291.534/0001-50', true),
('Hertz', '48.981.780/0001-48', true),
('Movida', '19.812.341/0001-92', true),
('Unidas', '92.241.953/0001-50', true)
ON CONFLICT DO NOTHING;