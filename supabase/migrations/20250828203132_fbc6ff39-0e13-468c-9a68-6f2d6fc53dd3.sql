-- Criar tabela para múltiplos anexos das tarefas
CREATE TABLE public.tarefas_anexos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tarefa_id uuid NOT NULL,
  nome_original text NOT NULL,
  nome_arquivo text NOT NULL,
  tamanho bigint,
  tipo_arquivo text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.tarefas_anexos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para anexos das tarefas
CREATE POLICY "Usuários podem visualizar anexos de tarefas que têm acesso" 
ON public.tarefas_anexos 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários podem inserir anexos em tarefas" 
ON public.tarefas_anexos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Usuários podem atualizar anexos próprios" 
ON public.tarefas_anexos 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Usuários podem excluir anexos próprios" 
ON public.tarefas_anexos 
FOR DELETE 
USING (auth.uid() = created_by);

-- Índices para performance
CREATE INDEX idx_tarefas_anexos_tarefa_id ON public.tarefas_anexos(tarefa_id);
CREATE INDEX idx_tarefas_anexos_created_by ON public.tarefas_anexos(created_by);

-- Trigger para atualizar updated_at se necessário
CREATE TRIGGER update_tarefas_anexos_updated_at
BEFORE UPDATE ON public.tarefas_anexos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();