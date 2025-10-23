-- Adicionar campos da NFE à tabela estoque_movimentacoes_entradas
ALTER TABLE estoque_movimentacoes_entradas
ADD COLUMN IF NOT EXISTS id_credor TEXT,
ADD COLUMN IF NOT EXISTS numero TEXT,
ADD COLUMN IF NOT EXISTS id_empresa INTEGER,
ADD COLUMN IF NOT EXISTS id_documento TEXT;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_id_credor ON estoque_movimentacoes_entradas(id_credor);
CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_id_empresa ON estoque_movimentacoes_entradas(id_empresa);
CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_numero ON estoque_movimentacoes_entradas(numero);