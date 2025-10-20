-- Adicionar colunas de período da obra na tabela analises_contratuais
ALTER TABLE analises_contratuais
ADD COLUMN IF NOT EXISTS data_inicio_obra date,
ADD COLUMN IF NOT EXISTS data_fim_obra date;