
-- Adiciona a coluna para data real de conclusão na tabela de tarefas
ALTER TABLE public.tarefas
ADD COLUMN data_real_conclusao TIMESTAMP WITH TIME ZONE;
