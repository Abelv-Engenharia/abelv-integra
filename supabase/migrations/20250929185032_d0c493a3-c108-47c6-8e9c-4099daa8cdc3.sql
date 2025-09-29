-- Adicionar coluna desvio_id na tabela medidas_disciplinares
-- para rastrear qual desvio originou a medida disciplinar

ALTER TABLE public.medidas_disciplinares 
ADD COLUMN IF NOT EXISTS desvio_id uuid NULL;

-- Adicionar comentário na coluna
COMMENT ON COLUMN public.medidas_disciplinares.desvio_id IS 'Referência ao desvio que originou esta medida disciplinar';

-- Adicionar índice para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_medidas_disciplinares_desvio_id 
ON public.medidas_disciplinares(desvio_id);