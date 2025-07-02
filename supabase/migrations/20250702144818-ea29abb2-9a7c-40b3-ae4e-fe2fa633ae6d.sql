
-- Remover a constraint existente que não permite 'aguardando-validacao'
ALTER TABLE public.tarefas DROP CONSTRAINT IF EXISTS tarefas_status_check;

-- Criar nova constraint que inclui 'aguardando-validacao'
ALTER TABLE public.tarefas ADD CONSTRAINT tarefas_status_check 
CHECK (status IN ('programada', 'em-andamento', 'pendente', 'concluida', 'aguardando-validacao'));
