
-- Adiciona a coluna 'titulo' na tabela de tarefas
ALTER TABLE public.tarefas
ADD COLUMN titulo TEXT;

-- Opcional: ordena após o id para melhor visualização (apenas para humanos, não afeta ordem física dos dados)
-- Não é necessário em Postgres, ordem visual é via SELECT.

-- Você pode adicionar posteriormente NOT NULL ou constraints se desejar no futuro.
