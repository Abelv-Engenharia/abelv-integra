-- Criar tabela para relatórios de elétrica/instrumentação
CREATE TABLE IF NOT EXISTS public.relatorios_eletrica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL,
  projeto TEXT NOT NULL,
  responsavel TEXT,
  localizacao TEXT,
  condicoes_climaticas JSONB,
  condicao_descricao TEXT,
  indice_pluviometrico TEXT,
  anotacoes_gerais TEXT,
  comentarios TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  cca_id UUID REFERENCES public.ccas(id),
  encarregado_id UUID REFERENCES public.encarregados_eletrica(id),
  localizacao_id UUID REFERENCES public.areas_projeto(id)
);

-- Habilitar RLS
ALTER TABLE public.relatorios_eletrica ENABLE ROW LEVEL SECURITY;

-- Criar política de acesso total
CREATE POLICY "Allow all access to relatorios_eletrica" 
ON public.relatorios_eletrica 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Criar tabela para atividades principais de elétrica
CREATE TABLE IF NOT EXISTS public.atividades_principais_eletrica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  relatorio_id UUID NOT NULL REFERENCES public.relatorios_eletrica(id) ON DELETE CASCADE,
  atividade_cadastrada_id UUID NOT NULL REFERENCES public.atividades_cadastradas(id),
  nome_atividade TEXT NOT NULL,
  equipe JSONB NOT NULL DEFAULT '[]'::jsonb,
  horas_informadas NUMERIC NOT NULL DEFAULT 0,
  total_pessoas INTEGER NOT NULL DEFAULT 0,
  horas_totais NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.atividades_principais_eletrica ENABLE ROW LEVEL SECURITY;

-- Criar política de acesso total
CREATE POLICY "Allow all access to atividades_principais_eletrica" 
ON public.atividades_principais_eletrica 
FOR ALL 
USING (true);

-- Criar tabela para etapas/registros detalhados de atividades elétricas
CREATE TABLE IF NOT EXISTS public.registro_atividades_eletrica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  atividade_principal_id UUID NOT NULL REFERENCES public.atividades_principais_eletrica(id) ON DELETE CASCADE,
  tipo_atividade TEXT NOT NULL,
  -- Campos para ELE-INFRA
  desenho_id UUID REFERENCES public.desenhos_eletrica(id),
  tipo_infraestrutura_id UUID REFERENCES public.tipos_infraestrutura_eletrica(id),
  dimensao_infra TEXT,
  quantidade TEXT,
  -- Campos para ELE-CABOS
  cabo_id UUID REFERENCES public.cabos_eletrica(id),
  ponto_origem TEXT,
  ponto_destino TEXT,
  etapa_cabos JSONB,
  metragem TEXT,
  disciplina TEXT,
  area_id UUID REFERENCES public.areas_projeto(id),
  -- Campos para ELE-EQUIP
  tipo_equipamento TEXT,
  equipamento_id UUID REFERENCES public.equipamentos_eletricos(id),
  -- Campos para INS-INST
  fluido_id UUID REFERENCES public.fluidos(id),
  linha_id UUID REFERENCES public.linhas(id),
  tipo_instrumento TEXT,
  instrumento_id UUID REFERENCES public.instrumentos_eletrica(id),
  -- Campos para ELE-LUMI
  tipo_luminaria TEXT,
  luminaria_id UUID REFERENCES public.luminarias_eletrica(id),
  etapa_luminaria JSONB,
  quantidade_montada TEXT,
  -- Campos gerais
  detalhamento_atividade TEXT,
  etapa_producao TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.registro_atividades_eletrica ENABLE ROW LEVEL SECURITY;

-- Criar política de acesso total
CREATE POLICY "Allow all access to registro_atividades_eletrica" 
ON public.registro_atividades_eletrica 
FOR ALL 
USING (true);