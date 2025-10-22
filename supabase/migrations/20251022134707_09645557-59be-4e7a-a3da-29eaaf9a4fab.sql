-- Corrigir dados existentes de veículos
-- Atualizar condutor_principal_id e condutor_principal_nome
UPDATE veiculos v
SET 
  condutor_principal_id = v.condutor_principal_nome::uuid,
  condutor_principal_nome = c.nome_condutor
FROM veiculos_condutores c
WHERE c.id::text = v.condutor_principal_nome
  AND v.condutor_principal_id IS NULL
  AND v.condutor_principal_nome ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Atualizar locadora_nome baseado no locadora_id
UPDATE veiculos v
SET locadora_nome = l.nome
FROM veiculos_locadoras l
WHERE l.id = v.locadora_id
  AND v.locadora_nome IS NULL;