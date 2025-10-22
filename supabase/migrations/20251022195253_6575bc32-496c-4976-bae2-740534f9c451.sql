-- Limpar campos duplicados criados pela migration anterior
-- Estes campos duplicam funcionalidades que já existem na tabela

-- Remover colunas duplicadas se existirem
ALTER TABLE public.prestadores_pj 
DROP COLUMN IF EXISTS valorajudaaluguel,
DROP COLUMN IF EXISTS valorajudacusto,
DROP COLUMN IF EXISTS tipocontrato;

-- Adicionar comentário explicativo nos campos corretos
COMMENT ON COLUMN public.prestadores_pj.ajudaaluguel IS 'Valor monetário da ajuda de aluguel (NUMERIC)';
COMMENT ON COLUMN public.prestadores_pj.ajudacusto IS 'Valor monetário da ajuda de custo (NUMERIC)';
COMMENT ON COLUMN public.prestadores_pj.tempocontrato IS 'Tipo/tempo de contrato: padrao ou determinado';