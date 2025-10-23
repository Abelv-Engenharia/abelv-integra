-- Remover FKs duplicadas (manter as nomeadas)
ALTER TABLE estoque_movimentacoes_entradas
DROP CONSTRAINT IF EXISTS id_empresa_fkey;

ALTER TABLE estoque_movimentacoes_entradas
DROP CONSTRAINT IF EXISTS id_credor_fkey;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_entradas_cca_id 
ON estoque_movimentacoes_entradas(cca_id);

CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_entradas_emissao 
ON estoque_movimentacoes_entradas(emissao);

CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_entradas_movimento 
ON estoque_movimentacoes_entradas(movimento);