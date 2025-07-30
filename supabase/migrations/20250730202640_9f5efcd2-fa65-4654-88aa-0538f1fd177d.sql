-- Adicionar o CCA 30 (1000 - ABELV) ao perfil Administrador
UPDATE perfis 
SET ccas_permitidas = ccas_permitidas || '[30]'::jsonb
WHERE nome = 'Administrador' 
AND NOT (ccas_permitidas ? '30');