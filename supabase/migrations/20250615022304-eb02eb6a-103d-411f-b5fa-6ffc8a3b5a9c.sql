
-- Remover constraint existente
ALTER TABLE notificacoes DROP CONSTRAINT IF EXISTS notificacoes_tarefa_id_fkey;

-- Adicionar constraint com ON DELETE CASCADE
ALTER TABLE notificacoes
  ADD CONSTRAINT notificacoes_tarefa_id_fkey
  FOREIGN KEY (tarefa_id)
  REFERENCES tarefas(id)
  ON DELETE CASCADE;
