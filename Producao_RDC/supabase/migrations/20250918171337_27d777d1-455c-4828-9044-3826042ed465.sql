-- Adicionar coluna ccas_ids na tabela areas_projeto para vincular CCAs às áreas
ALTER TABLE public.areas_projeto 
ADD COLUMN ccas_ids UUID[] DEFAULT '{}';

-- Criar índice para melhorar performance de consultas nos CCAs vinculados
CREATE INDEX idx_areas_projeto_ccas_ids ON public.areas_projeto USING GIN(ccas_ids);