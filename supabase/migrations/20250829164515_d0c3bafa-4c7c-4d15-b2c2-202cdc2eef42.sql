-- Criar tabela de relacionamento para múltiplos responsáveis por tarefa
CREATE TABLE public.tarefas_responsaveis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tarefa_id UUID NOT NULL REFERENCES public.tarefas(id) ON DELETE CASCADE,
  responsavel_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tarefa_id, responsavel_id)
);

-- Habilitar RLS
ALTER TABLE public.tarefas_responsaveis ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Usuários podem ver responsáveis de tarefas que podem acessar"
  ON public.tarefas_responsaveis
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários podem inserir responsáveis em tarefas que criaram"
  ON public.tarefas_responsaveis
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.tarefas 
      WHERE id = tarefa_id AND criado_por = auth.uid()
    )
  );

CREATE POLICY "Usuários podem atualizar responsáveis de tarefas que criaram"
  ON public.tarefas_responsaveis
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.tarefas 
      WHERE id = tarefa_id AND criado_por = auth.uid()
    )
  );

CREATE POLICY "Usuários podem excluir responsáveis de tarefas que criaram"
  ON public.tarefas_responsaveis
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.tarefas 
      WHERE id = tarefa_id AND criado_por = auth.uid()
    )
  );

-- Migrar dados existentes da coluna responsavel_id para a nova tabela
INSERT INTO public.tarefas_responsaveis (tarefa_id, responsavel_id)
SELECT id, responsavel_id 
FROM public.tarefas 
WHERE responsavel_id IS NOT NULL;

-- Remover a coluna responsavel_id da tabela tarefas (opcional, pode manter para compatibilidade)
-- ALTER TABLE public.tarefas DROP COLUMN responsavel_id;