-- Criar tabela para observações das tarefas
CREATE TABLE public.tarefa_observacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tarefa_id uuid NOT NULL REFERENCES public.tarefas(id) ON DELETE CASCADE,
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  observacao text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.tarefa_observacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem visualizar observações de tarefas onde são responsáveis ou criadores"
ON public.tarefa_observacoes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tarefas t 
    WHERE t.id = tarefa_id 
    AND (t.responsavel_id = auth.uid() OR t.criado_por = auth.uid())
  )
);

CREATE POLICY "Usuários podem inserir observações em tarefas onde são responsáveis ou criadores"
ON public.tarefa_observacoes FOR INSERT
WITH CHECK (
  auth.uid() = usuario_id AND
  EXISTS (
    SELECT 1 FROM public.tarefas t 
    WHERE t.id = tarefa_id 
    AND (t.responsavel_id = auth.uid() OR t.criado_por = auth.uid())
  )
);

CREATE POLICY "Usuários podem atualizar suas próprias observações"
ON public.tarefa_observacoes FOR UPDATE
USING (usuario_id = auth.uid())
WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Usuários podem excluir suas próprias observações"
ON public.tarefa_observacoes FOR DELETE
USING (usuario_id = auth.uid());

-- Índices para otimização
CREATE INDEX idx_tarefa_observacoes_tarefa_id ON public.tarefa_observacoes(tarefa_id);
CREATE INDEX idx_tarefa_observacoes_usuario_id ON public.tarefa_observacoes(usuario_id);
CREATE INDEX idx_tarefa_observacoes_created_at ON public.tarefa_observacoes(created_at DESC);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_tarefa_observacoes_updated_at
  BEFORE UPDATE ON public.tarefa_observacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();