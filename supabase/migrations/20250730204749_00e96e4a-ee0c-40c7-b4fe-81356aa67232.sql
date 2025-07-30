-- Atualizar status geral das ocorrências que têm ações atrasadas
UPDATE ocorrencias 
SET status = CASE 
  WHEN EXISTS (
    SELECT 1 FROM jsonb_array_elements(acoes) as acao 
    WHERE (acao->>'status')::text ILIKE '%atrasado%'
  ) THEN 'Pendente'
  ELSE status
END
WHERE acoes IS NOT NULL 
AND jsonb_array_length(acoes) > 0
AND status != 'Concluído';