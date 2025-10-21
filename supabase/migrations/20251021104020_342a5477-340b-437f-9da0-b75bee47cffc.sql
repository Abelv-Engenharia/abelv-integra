-- ================================================
-- MÓDULO DE VIAGENS - ESTRUTURA COMPLETA
-- ================================================

-- ================================================
-- 1. TABELA: faturas_viagens_integra
-- ================================================
CREATE TABLE public.faturas_viagens_integra (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dataemissaofat DATE NOT NULL,
  agencia TEXT NOT NULL CHECK (agencia IN ('Onfly', 'Biztrip')),
  numerodefat TEXT NOT NULL,
  protocolo TEXT NOT NULL,
  datadacompra DATE NOT NULL,
  viajante TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('rodoviario', 'aereo', 'hospedagem', 'bagagem', 'cancelamento', 'reembolso', 'remarcacao aereo')),
  hospedagem TEXT,
  origem TEXT NOT NULL,
  destino TEXT NOT NULL,
  checkin DATE,
  checkout DATE,
  comprador TEXT NOT NULL,
  valorpago DECIMAL(12,2) NOT NULL DEFAULT 0,
  motivoevento TEXT NOT NULL,
  cca TEXT NOT NULL,
  centrodecusto TEXT NOT NULL,
  antecedencia INTEGER,
  ciaida TEXT,
  ciavolta TEXT,
  possuibagagem TEXT NOT NULL CHECK (possuibagagem IN ('Sim', 'Não')),
  valorpagodebagagem DECIMAL(12,2),
  observacao TEXT,
  quemsolicitouforapolitica TEXT,
  dentrodapolitica TEXT NOT NULL CHECK (dentrodapolitica IN ('Sim', 'Não')),
  codconta TEXT,
  contafinanceira TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices para performance
CREATE INDEX idx_faturas_viagens_cca ON public.faturas_viagens_integra(cca);
CREATE INDEX idx_faturas_viagens_agencia ON public.faturas_viagens_integra(agencia);
CREATE INDEX idx_faturas_viagens_tipo ON public.faturas_viagens_integra(tipo);
CREATE INDEX idx_faturas_viagens_data ON public.faturas_viagens_integra(dataemissaofat);
CREATE INDEX idx_faturas_viagens_viajante ON public.faturas_viagens_integra(viajante);
CREATE INDEX idx_faturas_viagens_dentropol ON public.faturas_viagens_integra(dentrodapolitica);

-- ================================================
-- 2. TABELA: faturas_viagens_consolidadas
-- ================================================
CREATE TABLE public.faturas_viagens_consolidadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agencia TEXT NOT NULL CHECK (agencia IN ('Onfly', 'Biztrip')),
  numerofatura TEXT NOT NULL,
  dataemissao DATE NOT NULL,
  periodoapuracao TEXT NOT NULL,
  valortotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('Pendente', 'Pago', 'Em Aprovação', 'Lançado no Sienge')),
  cca TEXT NOT NULL,
  pdf_url TEXT,
  pdf_nome TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_faturas_consolidadas_status ON public.faturas_viagens_consolidadas(status);
CREATE INDEX idx_faturas_consolidadas_cca ON public.faturas_viagens_consolidadas(cca);
CREATE INDEX idx_faturas_consolidadas_periodo ON public.faturas_viagens_consolidadas(periodoapuracao);

-- ================================================
-- 3. TABELA: viagens_relatorios_salvos
-- ================================================
CREATE TABLE public.viagens_relatorios_salvos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  colunas_selecionadas TEXT[] NOT NULL DEFAULT '{}',
  filtros JSONB NOT NULL DEFAULT '{}',
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice
CREATE INDEX idx_relatorios_usuario ON public.viagens_relatorios_salvos(usuario_id);

-- ================================================
-- 4. TABELA: viagens_orcamentos_cca
-- ================================================
CREATE TABLE public.viagens_orcamentos_cca (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cca_id INTEGER NOT NULL REFERENCES public.ccas(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  orcamento_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  gasto_aereo DECIMAL(12,2) NOT NULL DEFAULT 0,
  gasto_rodoviario DECIMAL(12,2) NOT NULL DEFAULT 0,
  gasto_hotel DECIMAL(12,2) NOT NULL DEFAULT 0,
  gasto_outros DECIMAL(12,2) NOT NULL DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(cca_id, ano)
);

-- Índice
CREATE INDEX idx_orcamentos_cca_ano ON public.viagens_orcamentos_cca(cca_id, ano);

-- ================================================
-- 5. TABELA: viagens_destinatarios_alertas
-- ================================================
CREATE TABLE public.viagens_destinatarios_alertas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('gestor_obra', 'administrador', 'adicional')),
  cca_id INTEGER REFERENCES public.ccas(id) ON DELETE CASCADE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_destinatarios_tipo ON public.viagens_destinatarios_alertas(tipo);
CREATE INDEX idx_destinatarios_cca ON public.viagens_destinatarios_alertas(cca_id);

-- ================================================
-- 6. TRIGGERS - Atualizar updated_at
-- ================================================
CREATE TRIGGER update_faturas_viagens_integra_updated_at
  BEFORE UPDATE ON public.faturas_viagens_integra
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faturas_viagens_consolidadas_updated_at
  BEFORE UPDATE ON public.faturas_viagens_consolidadas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_viagens_relatorios_salvos_updated_at
  BEFORE UPDATE ON public.viagens_relatorios_salvos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_viagens_orcamentos_cca_updated_at
  BEFORE UPDATE ON public.viagens_orcamentos_cca
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_viagens_destinatarios_alertas_updated_at
  BEFORE UPDATE ON public.viagens_destinatarios_alertas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- 7. TRIGGER - Calcular antecedência automaticamente
-- ================================================
CREATE OR REPLACE FUNCTION public.calcular_antecedencia_viagem()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.datadacompra IS NOT NULL AND NEW.dataemissaofat IS NOT NULL THEN
    NEW.antecedencia := EXTRACT(DAY FROM (NEW.dataemissaofat - NEW.datadacompra))::INTEGER;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_calcular_antecedencia
  BEFORE INSERT OR UPDATE ON public.faturas_viagens_integra
  FOR EACH ROW
  EXECUTE FUNCTION public.calcular_antecedencia_viagem();

-- ================================================
-- 8. TRIGGER - Atualizar created_by automaticamente
-- ================================================
CREATE TRIGGER set_created_by_faturas_viagens_integra
  BEFORE INSERT ON public.faturas_viagens_integra
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_created_by_faturas_consolidadas
  BEFORE INSERT ON public.faturas_viagens_consolidadas
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_created_by_viagens_orcamentos
  BEFORE INSERT ON public.viagens_orcamentos_cca
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

-- ================================================
-- 9. STORAGE BUCKET - viagens-faturas-pdf
-- ================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('viagens-faturas-pdf', 'viagens-faturas-pdf', false)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 10. RLS - Habilitar para todas as tabelas
-- ================================================
ALTER TABLE public.faturas_viagens_integra ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faturas_viagens_consolidadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viagens_relatorios_salvos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viagens_orcamentos_cca ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viagens_destinatarios_alertas ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 11. RLS POLICIES - faturas_viagens_integra
-- ================================================
CREATE POLICY "Viagens integra - visualizar (autenticados com permissão)"
  ON public.faturas_viagens_integra
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      'viagens_visualizacao'::text = ANY(get_user_permissions(auth.uid()))
      OR 'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Viagens integra - criar (autenticados com permissão)"
  ON public.faturas_viagens_integra
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Viagens integra - atualizar (autenticados com permissão)"
  ON public.faturas_viagens_integra
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Viagens integra - deletar (autenticados com permissão)"
  ON public.faturas_viagens_integra
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

-- ================================================
-- 12. RLS POLICIES - faturas_viagens_consolidadas
-- ================================================
CREATE POLICY "Viagens consolidadas - visualizar (autenticados com permissão)"
  ON public.faturas_viagens_consolidadas
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      'viagens_visualizacao'::text = ANY(get_user_permissions(auth.uid()))
      OR 'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Viagens consolidadas - criar (autenticados com permissão)"
  ON public.faturas_viagens_consolidadas
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Viagens consolidadas - atualizar (autenticados com permissão)"
  ON public.faturas_viagens_consolidadas
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Viagens consolidadas - deletar (autenticados com permissão)"
  ON public.faturas_viagens_consolidadas
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

-- ================================================
-- 13. RLS POLICIES - viagens_relatorios_salvos
-- ================================================
CREATE POLICY "Relatórios salvos - gerenciar próprios"
  ON public.viagens_relatorios_salvos
  FOR ALL
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- ================================================
-- 14. RLS POLICIES - viagens_orcamentos_cca
-- ================================================
CREATE POLICY "Orçamentos CCA - visualizar (autenticados com permissão)"
  ON public.viagens_orcamentos_cca
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      'viagens_visualizacao'::text = ANY(get_user_permissions(auth.uid()))
      OR 'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
      OR cca_id = ANY(get_user_allowed_ccas(auth.uid()))
    )
  );

CREATE POLICY "Orçamentos CCA - criar (autenticados com permissão)"
  ON public.viagens_orcamentos_cca
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Orçamentos CCA - atualizar (autenticados com permissão)"
  ON public.viagens_orcamentos_cca
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

-- ================================================
-- 15. RLS POLICIES - viagens_destinatarios_alertas
-- ================================================
CREATE POLICY "Destinatários alertas - visualizar (autenticados)"
  ON public.viagens_destinatarios_alertas
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      'viagens_visualizacao'::text = ANY(get_user_permissions(auth.uid()))
      OR 'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Destinatários alertas - gerenciar (admin)"
  ON public.viagens_destinatarios_alertas
  FOR ALL
  USING (
    auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

-- ================================================
-- 16. STORAGE POLICIES - viagens-faturas-pdf
-- ================================================
CREATE POLICY "Faturas PDF - visualizar (autenticados com permissão)"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'viagens-faturas-pdf'
    AND auth.uid() IS NOT NULL
    AND (
      'viagens_visualizacao'::text = ANY(get_user_permissions(auth.uid()))
      OR 'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Faturas PDF - upload (autenticados com permissão)"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'viagens-faturas-pdf'
    AND auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Faturas PDF - atualizar (autenticados com permissão)"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'viagens-faturas-pdf'
    AND auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );

CREATE POLICY "Faturas PDF - deletar (autenticados com permissão)"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'viagens-faturas-pdf'
    AND auth.uid() IS NOT NULL
    AND (
      'viagens_gestao'::text = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
      OR '*'::text = ANY(get_user_permissions(auth.uid()))
    )
  );