-- Atualizar perfis administrativos para incluir automaticamente o novo CCA
UPDATE perfis 
SET ccas_permitidas = ccas_permitidas || '[31]'::jsonb
WHERE nome IN ('Administrador', 'Supervisor', 'Técnico') 
AND NOT (ccas_permitidas ? '31');