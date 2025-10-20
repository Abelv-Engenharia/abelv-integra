-- Adicionar novos campos para o painel de análise contratual completo
ALTER TABLE analises_contratuais
ADD COLUMN IF NOT EXISTS distancia_obra NUMERIC,
ADD COLUMN IF NOT EXISTS tipo_pagamento_detalhado TEXT,
ADD COLUMN IF NOT EXISTS aprovado_custo_engenheiro BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tem_taxa_lixo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tem_condominio BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tem_seguro_predial BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS valor_total_contrato NUMERIC,
ADD COLUMN IF NOT EXISTS valor_mensal_liquido NUMERIC,
ADD COLUMN IF NOT EXISTS numero_moradores INTEGER,
ADD COLUMN IF NOT EXISTS valor_por_morador NUMERIC,
ADD COLUMN IF NOT EXISTS particularidades TEXT,
ADD COLUMN IF NOT EXISTS checklist_reajuste BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS checklist_manutencao BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS checklist_vistoria_nr24 BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS checklist_seguro BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS checklist_foro BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS alertas_ativos JSONB DEFAULT '[]'::jsonb;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_analises_status_geral 
ON analises_contratuais(status_geral);

CREATE INDEX IF NOT EXISTS idx_analises_cca_codigo 
ON analises_contratuais(cca_codigo);