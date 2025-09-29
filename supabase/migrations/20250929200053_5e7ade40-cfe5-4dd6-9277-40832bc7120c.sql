-- Atualizar extintores sem CCA para associar à CCA "Obra 23101" (ID 6)
UPDATE extintores 
SET cca_id = 6 
WHERE cca_id IS NULL;