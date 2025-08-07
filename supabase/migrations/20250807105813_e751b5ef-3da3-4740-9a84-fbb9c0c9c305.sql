
-- Adicionar coluna CPF na tabela funcionarios
ALTER TABLE public.funcionarios 
ADD COLUMN cpf character varying(14);

-- Adicionar índice único para CPF para garantir que não haja duplicatas
CREATE UNIQUE INDEX idx_funcionarios_cpf_unique 
ON public.funcionarios (cpf) 
WHERE cpf IS NOT NULL AND cpf != '';

-- Comentário para documentar a coluna
COMMENT ON COLUMN public.funcionarios.cpf IS 'CPF do funcionário no formato XXX.XXX.XXX-XX';
