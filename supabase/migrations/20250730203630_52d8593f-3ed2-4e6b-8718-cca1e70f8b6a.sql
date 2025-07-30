-- Tentar atualizar com status 'Concluído' ao invés de 'Fechado'
UPDATE ocorrencias 
SET status = 'Concluído'
WHERE id = 'a586644a-36a8-4b19-b833-140abb1933ea';