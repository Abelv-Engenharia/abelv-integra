-- Remover colunas de detalhes de veículo e alojamento (não mais necessárias)
-- Mantemos apenas os campos booleanos veiculo e alojamento

ALTER TABLE prestadores_pj 
DROP COLUMN IF EXISTS detalhesveiculo,
DROP COLUMN IF EXISTS detalhesalojamento;

-- Adicionar comentários
COMMENT ON COLUMN prestadores_pj.veiculo IS 'Indica se o prestador terá veículo disponível (sim/não)';
COMMENT ON COLUMN prestadores_pj.alojamento IS 'Indica se o prestador terá alojamento disponível (sim/não)';