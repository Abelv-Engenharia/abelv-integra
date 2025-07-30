-- Adicionar o CCA 29 (23090 - AGROBIOLÓGICA - PROJETO HIMALAIA) ao perfil Administrador
UPDATE perfis 
SET ccas_permitidas = ccas_permitidas || '[29]'::jsonb
WHERE nome = 'Administrador' 
AND NOT (ccas_permitidas ? '29');