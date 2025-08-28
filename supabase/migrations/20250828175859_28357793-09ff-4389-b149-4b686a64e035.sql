-- Adicionar novas colunas na tabela checklists_avaliacao
ALTER TABLE public.checklists_avaliacao 
ADD COLUMN secoes JSONB DEFAULT '[]'::jsonb,
ADD COLUMN requer_assinatura BOOLEAN DEFAULT false;