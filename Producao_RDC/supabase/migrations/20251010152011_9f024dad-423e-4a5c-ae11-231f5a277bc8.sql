-- Adicionar coluna area_id à tabela instrumentos_eletrica
ALTER TABLE instrumentos_eletrica 
ADD COLUMN area_id uuid REFERENCES areas_projeto(id);

-- Criar índice para performance
CREATE INDEX idx_instrumentos_eletrica_area_id 
ON instrumentos_eletrica(area_id);

-- Atualizar registros existentes com base no desenho_id (se houver dados)
UPDATE instrumentos_eletrica inst
SET area_id = des.area_id
FROM desenhos_eletrica des
WHERE inst.desenho_id = des.id
  AND inst.area_id IS NULL;