-- Adicionar colunas de datas na tabela estoque_movimentacoes_entradas
ALTER TABLE public.estoque_movimentacoes_entradas 
ADD COLUMN IF NOT EXISTS emissao date,
ADD COLUMN IF NOT EXISTS movimento date;

-- Adicionar coluna descricao na tabela estoque_movimentacoes_entradas_itens
ALTER TABLE public.estoque_movimentacoes_entradas_itens 
ADD COLUMN IF NOT EXISTS descricao text;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_entradas_emissao 
ON public.estoque_movimentacoes_entradas(emissao);

CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_entradas_movimento 
ON public.estoque_movimentacoes_entradas(movimento);