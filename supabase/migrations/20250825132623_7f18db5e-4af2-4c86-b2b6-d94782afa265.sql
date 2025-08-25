-- Verificar e criar políticas RLS adequadas para a tabela tarefas

-- Remover políticas existentes se houver alguma conflitante
DROP POLICY IF EXISTS "Permitir acesso a usuário autenticado" ON public.tarefas;

-- Política para visualizar tarefas (responsável ou criador)
CREATE POLICY "Usuários podem ver suas tarefas como responsável ou criador"
ON public.tarefas
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    responsavel_id = auth.uid() OR 
    criado_por = auth.uid()
  )
);

-- Política para inserir tarefas
CREATE POLICY "Usuários autenticados podem criar tarefas"
ON public.tarefas
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  criado_por = auth.uid()
);

-- Política para atualizar tarefas (responsável ou criador)
CREATE POLICY "Usuários podem atualizar suas tarefas como responsável ou criador"
ON public.tarefas
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND (
    responsavel_id = auth.uid() OR 
    criado_por = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    responsavel_id = auth.uid() OR 
    criado_por = auth.uid()
  )
);

-- Política para excluir tarefas (apenas criador)
CREATE POLICY "Usuários podem excluir tarefas que criaram"
ON public.tarefas
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND
  criado_por = auth.uid()
);