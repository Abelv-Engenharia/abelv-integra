-- Adicionar coluna gravidade na tabela veiculos_multas
ALTER TABLE veiculos_multas 
ADD COLUMN IF NOT EXISTS gravidade TEXT CHECK (gravidade IN ('Leve', 'Média', 'Grave', 'Gravíssima'));