-- Adicionar todos os CCAs existentes ao perfil Administrador que ainda não estão na lista
UPDATE perfis 
SET ccas_permitidas = (
  SELECT jsonb_agg(DISTINCT value)
  FROM (
    SELECT jsonb_array_elements_text(ccas_permitidas) as value
    UNION 
    SELECT id::text as value FROM ccas WHERE ativo = true
  ) combined
)
WHERE nome = 'Administrador';