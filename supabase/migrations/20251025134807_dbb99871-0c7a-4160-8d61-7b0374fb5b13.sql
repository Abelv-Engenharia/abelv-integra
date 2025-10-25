-- Primeiro remover a constraint antiga
ALTER TABLE prestadores_notas_fiscais 
DROP CONSTRAINT IF EXISTS prestadores_notas_fiscais_status_check;

-- Atualizar registros existentes
UPDATE prestadores_notas_fiscais 
SET status = 'aguardando_aprovacao' 
WHERE status = 'enviado';

-- Adicionar nova constraint
ALTER TABLE prestadores_notas_fiscais 
ADD CONSTRAINT prestadores_notas_fiscais_status_check 
CHECK (status IN ('rascunho', 'aguardando_aprovacao', 'aprovado', 'reprovado', 'erro'));