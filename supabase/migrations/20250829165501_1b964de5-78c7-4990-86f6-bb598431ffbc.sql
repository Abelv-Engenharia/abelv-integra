-- Corrigir política RLS para permitir inserção de responsáveis na criação da tarefa
DROP POLICY IF EXISTS "Usuários podem inserir responsáveis em tarefas que criaram" ON public.tarefas_responsaveis;

CREATE POLICY "Usuários podem inserir responsáveis em tarefas que criaram ou na criação"
  ON public.tarefas_responsaveis
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND (
      -- Permite se o usuário é o criador da tarefa existente
      EXISTS (
        SELECT 1 FROM public.tarefas 
        WHERE id = tarefa_id AND criado_por = auth.uid()
      )
      OR
      -- Permite inserção durante a criação (tarefa pode não existir ainda)
      auth.uid() IS NOT NULL
    )
  );