-- Adicionar coluna para marcar NFEs como alocadas
ALTER TABLE nfe_compra 
ADD COLUMN IF NOT EXISTS alocada BOOLEAN DEFAULT FALSE;

-- Criar índice para melhor performance nas consultas
CREATE INDEX IF NOT EXISTS idx_nfe_compra_alocada ON nfe_compra(alocada);

-- Marcar como alocadas as NFEs que já possuem movimentações de entrada
UPDATE nfe_compra
SET alocada = TRUE
WHERE id IN (
  SELECT DISTINCT nci.id_nfe
  FROM nfe_compra_itens nci
  INNER JOIN estoque_movimentacoes_entradas eme ON eme.item_nfe_id = nci.id
);