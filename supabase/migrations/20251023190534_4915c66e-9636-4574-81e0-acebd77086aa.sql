-- Alterar o tipo do campo apropriacao_id de UUID para TEXT
-- Remover a constraint de FK existente
ALTER TABLE public.estoque_movimentacoes_saidas 
DROP CONSTRAINT IF EXISTS estoque_movimentacoes_saidas_apropriacao_id_fkey;

-- Alterar o tipo do campo para TEXT
ALTER TABLE public.estoque_movimentacoes_saidas 
ALTER COLUMN apropriacao_id TYPE TEXT USING apropriacao_id::TEXT;