-- Adicionar coluna contexto_uso na tabela checklists_avaliacao
ALTER TABLE public.checklists_avaliacao
ADD COLUMN contexto_uso text[] NOT NULL DEFAULT '{geral}';

-- Criar índice para otimizar buscas por contexto
CREATE INDEX idx_checklists_contexto_uso ON public.checklists_avaliacao USING GIN(contexto_uso);

-- Atualizar checklist de extintores para prevenção de incêndio
UPDATE public.checklists_avaliacao
SET contexto_uso = '{prevencao_incendio}'
WHERE nome ILIKE '%EXTINTOR%' OR nome ILIKE '%AGENTE EXTINTOR%';

-- Atualizar checklists de SMS (IFT e outros)
UPDATE public.checklists_avaliacao
SET contexto_uso = '{inspecao_sms}'
WHERE nome ILIKE '%IFT%' 
   OR nome ILIKE '%FRENTE DE TRABALHO%'
   OR nome ILIKE '%INSPEÇÃO DE SEGURANÇA%'
   OR (nome NOT ILIKE '%EXTINTOR%' AND contexto_uso = '{geral}');

-- Comentários explicativos
COMMENT ON COLUMN public.checklists_avaliacao.contexto_uso IS 'Contexto onde o checklist pode ser usado: inspecao_sms, prevencao_incendio, geral';