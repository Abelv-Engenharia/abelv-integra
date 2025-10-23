-- Adicionar coluna unitario na tabela estoque_movimentacoes_entradas_itens
ALTER TABLE estoque_movimentacoes_entradas_itens
ADD COLUMN unitario NUMERIC;