
-- Adicionar coluna criado_por na tabela tarefas
ALTER TABLE public.tarefas 
ADD COLUMN criado_por uuid REFERENCES auth.users(id);

-- Atualizar registros existentes para definir criado_por como responsavel_id (assumindo que quem criou foi quem se atribuiu)
UPDATE public.tarefas 
SET criado_por = responsavel_id 
WHERE criado_por IS NULL;

-- Tornar a coluna NOT NULL após a atualização
ALTER TABLE public.tarefas 
ALTER COLUMN criado_por SET NOT NULL;
