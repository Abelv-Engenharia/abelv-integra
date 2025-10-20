-- Adicionar colunas de integração Sienge na tabela medicoes_transporte
ALTER TABLE medicoes_transporte 
ADD COLUMN IF NOT EXISTS titulo_sienge TEXT,
ADD COLUMN IF NOT EXISTS situacao_sienge TEXT;